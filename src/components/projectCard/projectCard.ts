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
  private pinned: boolean = false;




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
    if (this.project.data.pins[this.$store.getters.user.id] === undefined ||
      this.project.data.pins[this.$store.getters.user.id] === false) {
      this.project.data.pins[this.$store.getters.user.id] = true;
    } else {
      this.project.data.pins[this.$store.getters.user.id] = false;
    }

    this.project.save();
  }
  private async onDelete() {
    try {
      await this.$dialogSimple.open('삭제할거냐?', '뭐', '취소', '삭제');
      console.log('ok');
      // TODO 삭제
    } catch (e) {
      console.log('cancel');
      // 취소
    }
  }

  private async renameProjectTitle() {
    try {
      const title = await this.$dialogInput.open('이름 변경', this.project.data.name, '취소', '이름 변경');
      this.project.data.name = title;
      await this.project.saveSync();
      this.$emit('change-snackbar-text', '이름이 변경되었습니다.');
    } catch (e) {
      console.error(e);
    }

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
