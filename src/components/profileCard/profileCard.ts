import { Vue, Component } from 'vue-property-decorator';
import { Auth } from '@/vue-common';

@Component({})
export default class ProfileCard extends Vue {
  public signOut() {
    Auth.signOut();
    this.$router.push('/');
    this.$emit('close');
  }
}
