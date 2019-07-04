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

  private uploadFile() {
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
    const file = e.target.files[0];
    console.log(file);

    const files = Collections.files.create(ProjectFile);
    files.data.uid = this.$store.getters.user.data.uid;
    files.data.pid = this.project.id;
    files.data.uploadDate = new Date().toUTCString();
    files.data.fileType = e.target.type;
    files.data.name = file.name;
    const storage = new Storage('files/');
    await storage.upload(file);
    files.data.fileURL = await storage.getDownloadURL();
    files.saveSync();
    this.fileList.push(files);
  }

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

      const files = await Collections.files.get(ProjectFile);
      this.fileList = files;
    });
  }
}
