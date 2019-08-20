import { Vue, Component } from 'vue-property-decorator';
import { FirestoreDocument, Log } from '@/vue-common';
import ProjectFile, { Tags, TagValue } from '@/models/projectFile';
import Project from '@/models/project';
import Collections from '@/models/collections';
import _ from 'lodash';


@Component({})
export default class DialogTag extends Vue {
  private show: boolean = false;
  private inputValue: string = '';
  private file!: FirestoreDocument<ProjectFile>;
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
    return _.filter(this.project.data.tags, (v, k) => {
      return k.indexOf(this.inputValue) !== -1;
    });
  }
  private async deleteTag(tag: string) {
    if (this.file.data.tags[tag] !== undefined) {
      Vue.delete(this.file.data.tags, tag);
      await this.file.saveSync();
    }
  }
  private setMainTag(tag: TagValue) {
    _.forEach(this.file.data.tags, v => v.selected = false);
    Vue.set(tag, 'selected', true);
  }

  private async createTag(tagName: string, color?: string) {
    // const tagName = this.inputValue;
    console.log('created tag called');
    this.inputValue = '';
    if (_.isEmpty(tagName)) {
      console.log('exit');
      return;
    }

    if (this.file.data.tags[tagName] === undefined) {
      Vue.set(this.file.data.tags, tagName, {
        name: tagName,
        count: 0,
        selected: false,
      });
    }
    await this.file.saveSync();

    if (this.project.data.tags[tagName] === undefined) {
      Vue.set(this.project.data.tags, tagName, {
        name: tagName,
        count: 0,
        selected: false,
      });
      await this.project.saveSync();
    }
  }
}
