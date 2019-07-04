import { Vue, Component, Prop } from 'vue-property-decorator';
import { FirestoreDocument } from '@/vue-common';
import Project from '@/models/project';
import User from '@/models/user';
import Collections from '@/models/collections';

@Component({})
export default class ProjectCard extends Vue {
  @Prop()
  // public project!: {
  //   item: FirestoreDocument<Project>;
  //   selected: boolean;
  // };
  public project!: FirestoreDocument<Project>;
  public owner: FirestoreDocument<User> = Collections.users.create(User);

  private async mounted() {
    for (const key of Object.keys(this.project.data.users)) {
      if (this.project.data.users[key] === 'supervisor') {
        this.owner = await Collections.users.load(User, key);
      }
    }
  }

  private onClick() {
    // this.project.selected
    //   ? (this.project.selected = false)
    //   : (this.project.selected = true);
    // console.log(this.project.selected);
  }

  private goToProject() {
    this.$router.push(`/myprojects/${this.project.id}`);
  }
}
