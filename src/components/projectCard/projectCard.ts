import { Vue, Component, Prop } from 'vue-property-decorator';
import { FirestoreDocument, Storage } from '@/vue-common';
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
  private moreMenuClicked = false;
  private removeDialog = false;
  private renameDialog = false;
  private projectTitle = this.project.data.name;
  private selected: string = '';

  private removeProject() {
    const storage = new Storage(`images/${this.project.id}`);
    storage.delete();
    this.project.delete();
    this.removeDialog = false;
  }

  private showMoreMenu() {
    this.$emit('show-more-menu', this.project.id);
  }

  private async pinnedProject() {
    if (this.project.data.pin) {
      await this.project.update({ pin: false });
    } else {
      await this.project.update({ pin: true });
    }
  }

  private async renameProjectTitle() {
    await this.project.update({ name: `${this.projectTitle}` });
    this.renameDialog = false;
    this.projectTitle = this.project.data.name;
    this.$emit('change-snackbar-text', '이름이 변경되었습니다.');
  }

  private changeMainImage() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.style.display = 'none';
    input.addEventListener('change', this.onChange);
    input.click();
    document.body.appendChild(input);
  }

  private async onChange(e) {
    console.log(e);
    this.$emit('show-progress-bar');
    const file = e.target.files[0];
    const storage = new Storage(`/images/${this.project.id}`);
    await storage.upload(file);
    const url = await storage.getDownloadURL();
    this.project.update({ imageURL: `${url}` });
  }

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
    this.$store.commit('setCurrentProject', this.project);
    this.$emit('go-project');
    // this.$router.push(`/myprojects/${this.project.id}`);
  }
}
