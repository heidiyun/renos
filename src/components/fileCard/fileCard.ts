import { Vue, Component, Prop } from 'vue-property-decorator';
import { FirestoreDocument, Storage } from '@/vue-common';
import ProjectFile from '@/models/projectFile';
import Opener from '../opener';
import Collections from '@/models/collections';
import _ from 'lodash';
import User from '@/models/user';
import ActivityBoard from '@/models/activityBoard';
import ActivityType from '@/models/ActivityType';

@Component({})
export default class FileCard extends Vue {
  public $refs!: {
    opener: Opener;
    tagOpener: Opener;
  };
  @Prop()
  public file!: FirestoreDocument<ProjectFile>;
  @Prop()
  public role!: string;
  private enableDelete: boolean = false;
  private menu: boolean = false;
  @Prop()
  private tags!: { name: string; color: string }[];
  private defaultTags = ['design', 'resource', 'code', 'layout'];
  private inputVisible: boolean = false;
  private mainTag = '';
  private fileOwner = Collections.users.create(User);
  private is: boolean = false;

  private addTag() {
    this.$dialogTag.on(this.file);
  }

  private addBookmark() {
    this.file.data.pins[this.$store.getters.user.id] = true;
    this.file.saveSync();
  }

  private removeBookmark() {
    this.file.data.pins[this.$store.getters.user.id] = false;
    this.file.saveSync();
  }

  private async addMaterialDocument() {
    this.file.data.isMaterialDocument = true;
    this.file.data.ownerMaterialDocument = this.$store.getters.user.id;
    this.file.saveSync();

    const activities = Collections.activityBoards.create(ActivityBoard);

    activities.data.activeUid = this.$store.getters.user.id;
    activities.data.date = new Date().toUTCString();
    activities.data.targetPid = this.$store.getters.currentProject.id;
    activities.data.targetFid = this.file.id;
    activities.data.type = ActivityType.SHARE;
    await activities.saveSync();
  }

  private removeMaterialDocument() {
    this.file.data.isMaterialDocument = false;
    this.file.data.ownerMaterialDocument = '';
    this.file.saveSync();
  }

  private async onDelete() {
    this.$progress.show();
    await this.file.delete();
    if (this.fileIcon.tag === 'image' || this.fileIcon.tag === 'video') {
      const storage = new Storage(`/files/${this.file.id}`);
      await storage.delete();
    }

    this.$progress.off();
  }

  private isAuthorized() {
    if (
      this.file.data.uid === this.$store.getters.user.id ||
      this.role === 'supervisor'
    ) {
      this.enableDelete = true;
      return;
    } else {
      this.enableDelete = false;
      return;
    }
  }

  private async showPreview() {
    this.file.data.accessDate = new Date().toUTCString();
    await this.file.saveSync();

    this.$dialogPreview.on(
      this.file.data.name,
      this.file.data.fileType,
      this.file.data.fileURL
    );
  }

  private showComment() {
    this.$store.commit('setSelectedFile', this.file);
    this.$emit('open-comment');
  }

  private pickMainTag(tag) {
    if (this.mainTag !== '') {
      const index = this.file.data.tags.findIndex(t => {
        return this.mainTag === t.name;
      });
      this.file.data.tags[index].selected = false;
    }
    if (this.mainTag === tag.name) {
      this.mainTag = '';
      return;
    }

    const index = this.file.data.tags.findIndex(t => {
      return t.name === tag.name;
    });
    this.mainTag = tag.name;

    this.file.data.tags[index].selected = true;
    this.file.saveSync();
  }

  private get currentFileMainTag() {
    this.mainTag = '';
    for (const tag of this.file.data.tags) {
      if (tag.selected) {
        this.mainTag = tag.name;
      }
    }

    return this.mainTag;
  }

  private get fileIcon() {
    // TODO 확장자 추가 or로 달고 image는 필요없음.
    const fileExtension = this.file.data.name.split('.');
    if (this.file.data.fileType.startsWith('image')) {
      return {
        tag: 'image',
        kind: 'image',
        icon: 'image',
        color: 'rgb(240,180,0)'
      };
    } else if (this.file.data.fileType.startsWith('application/pdf')) {
      return {
        tag: 'pdf',
        kind: 'file',
        icon: 'file-pdf',
        color: 'rgb(233,67,52)'
      };
    } else if (this.file.data.fileType.startsWith('video')) {
      return {
        tag: 'video',
        kind: 'video',
        icon: 'video-camera',
        playable: this.file.data.name.endsWith('.mp4'),
        color: 'rgb(217, 48, 37)'
      };
    } else if (
      fileExtension[1] === 'docx' ||
      fileExtension[1] === 'doc' ||
      this.file.data.fileType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return {
        tag: 'word',
        kind: 'file',
        icon: 'file-word',
        color: 'rgb(75, 135, 228)'
      };
    } else if (
      fileExtension[1] === 'xlsx' ||
      fileExtension[1] === 'xls' ||
      this.file.data.fileType ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return {
        tag: 'excel',
        kind: 'file',
        icon: 'file-excel',
        color: 'rgb(14, 157, 89)'
      };
    } else if (
      fileExtension[1] === 'pptx' ||
      this.file.data.fileType ===
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ) {
      return {
        tag: 'ppt',
        kind: 'file',
        icon: 'file-ppt',
        color: 'rgb(253, 117, 65)'
      };
    } else {
      return {
        tag: 'file',
        kind: 'file',
        icon: 'file',
        color: 'rgb(192,192,192)'
      };
    }
  }

  private async mounted() {
    this.file.data.kind = this.fileIcon.kind;
    this.file.saveSync();
    this.fileOwner = await Collections.users.load(User, this.file.data.uid);
    console.log(this.file.data.kind);

    if (this.file.data.tags.length >= 1 && this.file.data.tags[0].name === '') {
      this.file.data.tags.splice(0, 1);
      this.file.saveSync();
    }
  }
}
