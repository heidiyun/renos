import { Vue, Component, Prop } from 'vue-property-decorator';
import { FirestoreDocument, Auth } from '@/vue-common';
import ProjectFile from '@/models/projectFile';
import Collections from '@/models/collections';
import User from '@/models/user';

@Component({})
export default class FileTable extends Vue {
  @Prop()
  private fileList!: Array<FirestoreDocument<ProjectFile>>;
  private users: Array<FirestoreDocument<User>> = [];
  private columns = [
    {
      title: '이름',
      dataIndex: 'name',
      width: '600px'
    },
    {
      title: '소유자',
      dataIndex: 'userName'
    },
    {
      title: '파일크기',
      dataIndex: 'fileSize'
    }
  ];

  private get currentFileList() {
    return this.fileList.map(f => {
      let userName: string = '';
      for (const user of this.users) {
        if (user.id === f.data.uid) {
          userName = user.data.name;
        }
      }
      return {
        name: f.data.name,
        userName: userName,
        fileSize: f.data.fileSize
      };
    });
  }

  private async uidToUserName() {
    const keys = Object.keys(this.$store.getters.currentProject.data.users);
    for (const key of keys) {
      this.users.push(await Collections.users.load(User, key));
    }
  }

  private mounted() {
    this.uidToUserName();
  }
}
