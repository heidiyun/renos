import { Vue, Component } from 'vue-property-decorator';
import { FirestoreDocument } from '@/vue-common';
import ProjectFile from '@/models/projectFile';

@Component({})
export default class DialogTag extends Vue {
  private show: boolean = true;
  private inputValue: string = '';
  private visibleList = false;
  private file!: FirestoreDocument<ProjectFile>;
  private tags!: { name: string; color: string }[];

  public on(file: FirestoreDocument<ProjectFile>, tags) {
    this.show = true;
    this.file = file;
    this.tags = tags;
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

    return this.tags.filter(t => {
      return t.name.indexOf(this.inputValue) !== -1;
    });
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

    this.$emit('added-tag', tagName, tagColor);
  }
}
