import { Vue, Component } from 'vue-property-decorator';
import { Auth, SignInMethod } from '@/vue-common';

@Component({})
export default class Login extends Vue {
  private disabledButton: boolean = true;
  private login() {
    if (this.$store.getters.user !== undefined) {
      this.$router.push('/projects');
      // window.location.assign('/');
      return;
    }
    Auth.signIn(SignInMethod.Google);
  }

  private mounted() {
    this.$progress.show();
    Auth.addChangeListener('login', () => {
      this.disabledButton = false;
      this.$progress.off();
    });
  }
}
