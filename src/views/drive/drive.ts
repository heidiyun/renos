import { Vue, Component, Watch } from 'vue-property-decorator';
import { Auth, FirestoreDocument, Storage } from '@/vue-common';
import Collections from '@/models/collections';
import Project from '@/models/project';
import User from '@/models/user';
import toast from '@/vue-common/plugins/toast';
import ProjectFile from '@/models/projectFile';
import _ from 'lodash';

@Component({})
export default class Drive extends Vue {
  private members: Array<FirestoreDocument<User>> = [];
  private isOwner: boolean = false;
  private project: FirestoreDocument<Project> = Collections.projects.create(
    Project
  );
  private fileList: Array<FirestoreDocument<ProjectFile>> = [];

  @Watch('$route', { deep: true })
  private onChangeRoute() {
    this.initailize();
  }

  private async initailize() {
    const pid = this.$route.params.projectName;
    this.project = await Collections.projects.load(Project, pid);

    this.$store.commit('setCurrentProject', this.project);

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

    this.fileList = [];

    Collections.files
      .createQuery('pid', '==', this.project.id)
      .onChange(ProjectFile, (file, state) => {
        if (state === 'added') {
          this.fileList.push(file);
        } else if (state === 'removed') {
          const index = _.findIndex(this.fileList, f => f.id === file.id);
          this.fileList.splice(index, 1);
        } else if (state === 'modified') {
          const index = _.findIndex(this.fileList, f => f.id === file.id);
          this.fileList.splice(index, 1, file);
        }
      });

  }


  private async mounted() {
    Auth.addChangeListener('driveAuth', async () => {
      this.initailize();
    });
  }
}
