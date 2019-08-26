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
    const fileExtension = this.activity.data.fileName.split('.');
    if (this.activity.data.fileType.startsWith('image')) {
      return {
        tag: 'image',
        kind: 'image',
        icon: 'image',
        color: 'rgb(240,180,0)'
      };
    } else if (this.activity.data.fileType.startsWith('application/pdf')) {
      return {
        tag: 'pdf',
        kind: 'file',
        icon: 'file-pdf',
        color: 'rgb(233,67,52)'
      };
    } else if (this.activity.data.fileType.startsWith('video')) {
      return {
        tag: 'video',
        kind: 'video',
        icon: 'video-camera',
        playable: this.activity.data.fileName.endsWith('.mp4'),
        color: 'rgb(217, 48, 37)'
      };
    } else if (
      fileExtension[1] === 'docx' ||
      fileExtension[1] === 'doc' ||
      this.activity.data.fileType ===
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
      this.activity.data.fileType ===
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
      this.activity.data.fileType ===
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

    switch (this.type) {
      case ActivityType.INVITE:
        this.explanation = `이(가) ${this.activity.data.inviteeRole}로 프로젝트에 참여했습니다.`;
        break;
      case ActivityType.UPLOAD:
        this.explanation = '이(가) 파일을 업로드 했습니다.';
        break;
      case ActivityType.SHARE:
        this.explanation = `이(가) 중요 문서함에 ${this.activity.data.fileName}을 공유했습니다.`;
        break;
      case ActivityType.WRITECOMMENT:
        if (this.activity.data.fileName !== null) {
          this.explanation = `이(가) ${this.activity.data.fileName}에 댓글을 작성했습니다.`;
        } else {
          this.explanation = '이(가) 프로젝트에 댓글을 작성했습니다.';
        }
        break;
      case ActivityType.MODIFYCOMMENT:
        this.explanation = '이(가) 댓글을 수정했습니다.';
        break;
    }

    // this.project = await Collections.projects.load(
    //   Project,
    //   this.activity.data.targetPid
    // );
  }
}
