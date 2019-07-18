import { Vue, Component } from 'vue-property-decorator';
import { Auth, SignInMethod } from '@/vue-common';

@Component({})
export default class Login extends Vue {
  private login() {
    if (this.$store.getters.user !== undefined) {
      this.$router.push('/projects');
    } else {
      Auth.signIn(SignInMethod.Google);
    }
  }
}
