import { Vue, Component, Prop } from 'vue-property-decorator';
import { FirestoreDocument, Storage } from '@/vue-common';
import ProjectFile, { Tags } from '@/models/projectFile';
import Opener from '../opener';
import Collections from '@/models/collections';
import _ from 'lodash';
import User from '@/models/user';
import ActivityBoard from '@/models/activityBoard';
import ActivityType from '@/models/ActivityType';
import util from '@/util';
import Notification, { NotificationType } from '@/models/notification';
import Project from '@/models/project';

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
  // TODO TAG Type 정의
  @Prop()
  private tags!: Tags;
  private defaultTags = ['design', 'resource', 'code', 'layout'];
  private inputVisible: boolean = false;
  private fileOwner = Collections.users.create(User);
  private is: boolean = false;

  private get mainTag() {
    let tag = '';
    _.forEach(this.file.data.tags, (v, k) => {
      if (v.selected) {
        tag = k;
      }
    });
    return tag;
  }
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
    this.file.data.shareDate = new Date().toUTCString();
    this.file.saveSync();

    const uid = this.$store.getters.user.id;
    const pid = this.$store.getters.currentProject.id;
    const fid = this.file.id;

    util.saveActivity(ActivityType.SHARE, uid, pid, fid, null);

    const notification = Collections.notifications.create(Notification);
    const project = await Collections.projects.load(
      Project,
      this.$store.getters.currentProject.id
    );

    const recipientUids = Object.keys(project.data.users).filter(key => {
      return this.$store.getters.user.id !== key;
    });

    notification.data.activistUid = uid;
    notification.data.pid = pid;
    notification.data.fid = fid;
    notification.data.recipientUid = recipientUids;
    notification.data.type = NotificationType.SHARE;

    notification.save();
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

  // private pickMainTag(tag) {
  //   if (this.mainTag !== '') {
  //     this.file.data.tags[this.mainTag].selected = false;
  //   }
  //   if (this.mainTag === tag.name) {
  //     this.mainTag = '';
  //     return;
  //   }
  //   this.mainTag = tag.name;
  //   this.file.data.tags[tag].selected = true;
  //   this.file.saveSync();
  // }

  // TODO Change

  private get fileIcon() {
    // TODO  Util로 뽑기
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

    // this.$app.util
  }
}
