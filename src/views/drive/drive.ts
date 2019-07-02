import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class Drive extends Vue {
  private category: {
    item: string;
    active: boolean;
  }[] = [
    {
      item: '관리자로 있는 프로젝트',
      active: true
    },
    {
      item: '편집자로 있는 프로젝트',
      active: false
    },
    {
      item: '관찰자로 있는 프로젝트',
      active: false
    }
  ];
}
