import { Vue, Component } from 'vue-property-decorator';
import { Auth, FirestoreDocument, Storage } from '@/vue-common';
import Collections from '@/models/collections';
import Project from '@/models/project';
import User from '@/models/user';
import toast from '@/vue-common/plugins/toast';
import ProjectFile from '@/models/projectFile';

@Component({})
export default class Drive extends Vue {
  private members: Array<FirestoreDocument<User>> = [];
  private isOwner: boolean = false;
  private project: FirestoreDocument<Project> = Collections.projects.create(
    Project
  );
  private fileList: Array<FirestoreDocument<ProjectFile>> = [];

  

  private mounted() {
    const pid = this.$route.params.projectName;
    Auth.addChangeBeforeListener('drive', async u => {
      //사용자를 갖고올거야.
      this.project = await Collections.projects.load(Project, pid);
      const keys = Object.keys(this.project.data.users);

      const users: Array<FirestoreDocument<User>> = [];
      for (const key of keys) {
        if (this.project.data.users[key] === 'supervisor') {
          if (key === this.$store.getters.user.id) {
            this.isOwner = true;
          }
        }
        users.push(await Collections.users.load(User, key));
      }
      this.members = users;

      const files = await Collections.files
        .createQuery('pid', '==', this.project.id)
        .exec(ProjectFile);
      this.fileList = files;
    });
  }
}
