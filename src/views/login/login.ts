import { Vue, Component } from 'vue-property-decorator';
import { Auth, SignInMethod } from '@/vue-common';

@Component({})
export default class Login extends Vue {
  private login() {
    Auth.signIn(SignInMethod.Google);
  }
}
