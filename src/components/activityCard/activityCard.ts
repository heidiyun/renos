import { Vue, Component, Prop } from 'vue-property-decorator';
import { FirestoreDocument } from '@/vue-common';
import ActivityBoard from '@/models/activityBoard';
import Collections from '@/models/collections';
import User from '@/models/user';
import ProjectFile from '@/models/projectFile';
import Project from '@/models/project';
import moment from 'moment';
import ActivityType from '@/models/ActivityType';

@Component({})
export default class ActivityCard extends Vue {
  @Prop()
  private activity!: FirestoreDocument<ActivityBoard>;
  private user: FirestoreDocument<User> = Collections.users.create(User);
  private invitee: FirestoreDocument<User> = Collections.users.create(User);
  private file: FirestoreDocument<ProjectFile> = Collections.files.create(
    ProjectFile
  );
  private project: FirestoreDocument<Project> = Collections.projects.create(
    Project
  );
  private date: string = '';
  private type!: ActivityType;
  private explanation: string = '';

  private get fileIcon() {
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
    if (this.activity.data.type === undefined) {
      return;
    }
    this.type = this.activity.data.type;
    this.date = moment(this.activity.data.date).format('YYYY년 MM월 DD일');
    this.user = await Collections.users.load(
      User,
      this.activity.data.activeUid
  );

    switch (this.type) {
      case ActivityType.INVITE:
        this.invitee = await Collections.users.load(
          User,
          this.activity.data.inviteeUid
        );
        break;
      case ActivityType.UPLOAD:
        this.file = await Collections.files.load(
          ProjectFile,
          this.activity.data.targetFid
        );
        this.explanation = '이(가) 파일을 업로드 했습니다.';
        break;
      case ActivityType.SHARE:
        this.file = await Collections.files.load(
          ProjectFile,
          this.activity.data.targetFid
        );
        this.explanation = '이(가) 중요 문서함에 파일을 공유했습니다.';
        break;
      case ActivityType.WRITECOMMENT:
        if (this.activity.data.targetFid !== '') {
          this.file = await Collections.files.load(
            ProjectFile,
            this.activity.data.targetFid
          );
        }
        this.explanation = '이(가) 댓글을 작성했습니다.';
        break;
    }

    // this.project = await Collections.projects.load(
    //   Project,
    //   this.activity.data.targetPid
    // );
  }
}
