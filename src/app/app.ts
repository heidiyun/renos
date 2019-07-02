import { Vue, Component } from 'vue-property-decorator';
import { Auth } from '@/vue-common';
import User from '@/models/user';
import Collections from '@/models/collections';

@Component({})
export default class App extends Vue {
  private mounted() {
    Auth.addChangeBeforeListener('login', async u => {
      if (u !== null) {
        const exist = await Collections.users.exist(u.uid);

        if (exist) {
          const user = await Collections.users.load(User, u.uid);
          this.$store.commit('setUser', user);
        } else {
          const user = Collections.users.create(User, u.uid);
          user.data.name = u.displayName ? u.displayName : '';
          user.data.email = u.email ? u.email : '';
          user.data.photoURL = u.photoURL ? u.photoURL : '';
          user.data.uid = u.uid ? u.uid : '';
          user.saveSync();
          this.$store.commit('setUser', user);
        }
        this.$router.push('/myprojects');
      } else {
        this.$store.commit('setUser', undefined);
      }
    });
  }
}
