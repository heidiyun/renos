import { Vue, Component } from 'vue-property-decorator';
import { FirestoreDocument, Log } from '@/vue-common';
import ProjectFile from '@/models/projectFile';
import Project from '@/models/project';
import Collections from '@/models/collections';

@Component({})
export default class DialogTag extends Vue {
  private show: boolean = false;
  private inputValue: string = '';
  private visibleList = false;
  private file!: FirestoreDocument<ProjectFile>;
  private tags: { name: string; color: string }[] = [];
  private project: FirestoreDocument<Project> = Collections.projects.create(
    Project
  );
  public async on(file: FirestoreDocument<ProjectFile>) {
    this.show = true;
    this.file = file;
    this.project = await Collections.projects.load(Project, file.data.pid);
  }

  public off() {
    this.show = false;
  }

  private get exampleTags() {
    // let ret;
    // _(this.tags).forEach(t => {
    //   if (this.file.data.tags.length === 0){ return this.tags};
    //   for (const tag of this.file.data.tags) {
    //    if (t !== tag) ret.push(t);
    //   }
    // })

    return this.project.data.tags.filter(t => {
      return t.name.indexOf(this.inputValue) !== -1;
    });
  }
  private async deleteTag(tag: string) {
    const index = this.file.data.tags.findIndex(t => {
      return t.name === tag;
    });

    this.file.data.tags.splice(index, 1);
    await this.file.saveSync();
  }

  private async createTag(tagName: string, color?: string) {
    // const tagName = this.inputValue;
    this.visibleList = false;
    this.inputValue = '';
    if (tagName.length <= 0) {
      return;
    }

    let isEqual = false;
    for (const tag of this.file.data.tags) {
      if (tag.name === tagName) {
        isEqual = true;
      }
    }

    if (isEqual) {
      return;
    }

    isEqual = false;

    for (const tag of this.tags) {
      if (tagName === tag.name) {
        isEqual = true;
        color = tag.color;
      }
    }

    const tagColor = '#' + ((Math.random() * 0xffffff) << 0).toString(16);
    this.file.data.tags.push({
      name: tagName,
      color: color === undefined ? tagColor : color,
      selected: false
    });
    await this.file.saveSync();

    if (isEqual) {
      return;
    }

    this.project.data.tags.push({ name: tagName, color: tagColor });
    this.project.saveSync();
  }
}
