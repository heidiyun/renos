import { FirestoreCollection } from '@/vue-common';
import User from './user';
import ProjectFile from './projectFile';
import Comment from './comment';
import Project from './project';

export default class Collections {
  public static readonly users: FirestoreCollection<
    User
  > = new FirestoreCollection('/users');
  public static readonly projects: FirestoreCollection<
    Project
  > = new FirestoreCollection('/projects');
  public static readonly files: FirestoreCollection<
    ProjectFile
  > = new FirestoreCollection('/files');

  public static readonly comments: FirestoreCollection<
    Comment
  > = new FirestoreCollection('/comments');
}
