import sha1 from 'sha1';
import ProjectFile from '@/models/projectFile';
import Collections from '@/models/collections';
import { Storage } from '@/vue-common';
import ActivityBoard from '@/models/activityBoard';
import ActivityType from '@/models/ActivityType';
import Notification, { NotificationType } from '@/models/notification';
import Project from '@/models/project';
import User from '@/models/user';
import ActivityCard from '@/components/activityCard';
import Comment from '@/models/comment';

function HSVtoRGB(h, s, v) {
  let r;
  let g;
  let b;
  let i;
  let f;
  let p;
  let q;
  let t;

  if (arguments.length === 1) {
    (s = h.s), (v = h.v), (h = h.h);
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

export default {
  getReadableFileSizeString(bytes) {
    let i = 0;
    const byteUnits = [
      '바이트',
      'KB',
      'MB',
      'GB',
      'TB',
      'PB',
      'EB',
      'ZB',
      'YB'
    ];
    if (bytes > 1024) {
      do {
        bytes = bytes / 1024;
        i++;
      } while (bytes > 1024);
    }
    return Math.max(bytes, 0).toFixed(0) + byteUnits[i];
  },
  getNameToColor(name) {
    const sha = sha1(name);
    const r = parseInt(sha[0] + sha[1], 16);
    const c = HSVtoRGB(r / 256, 0.5, 0.6);
    return `rgb(${c.r},${c.g},${c.b})`;
  },
  async saveFile(e, pid: string, uid: string) {
    const files: File[] = e.target.files;
    for (const file of files) {
      const projectFile = Collections.files.create(ProjectFile);

      const storage = new Storage(`/files/${projectFile.id}`);
      await storage.upload(file);
      const url = await storage.getDownloadURL();

      projectFile.data.name = file.name;
      projectFile.data.pid = pid;
      projectFile.data.uid = uid;
      projectFile.data.uploadDate = new Date().toUTCString();
      projectFile.data.fileType = file.type;
      projectFile.data.fileURL = url;
      projectFile.data.fileSize = file.size;

      await projectFile.saveSync();
      this.saveActivity(
        ActivityType.UPLOAD,
        uid,
        pid,
        projectFile.id,
        null,
        null
      );
    }
  },
  async saveActivity(
    activityType,
    uid,
    pid,
    fid?,
    comments?,
    inviteeUid?,
    inviteeRole?
  ) {
    const activities = Collections.activityBoards.create(ActivityBoard);

    const user = await Collections.users.load(User, uid);

    if (fid !== null) {
      const file = await Collections.files.load(ProjectFile, fid);
      activities.data.fileName = file.data.name;
      activities.data.fileType = file.data.fileType;
      activities.data.fileURL = file.data.fileURL;
    }

    if (inviteeUid !== null) {
      const invitee = await Collections.users.load(User, inviteeUid);
      activities.data.inviteeUserName = invitee.data.name;
      activities.data.inviteeUserPhotoURL = invitee.data.photoURL;
      activities.data.inviteeRole = inviteeRole;
    }

    if (comments !== null) {
      const comment = await Collections.comments.load(Comment, comments);
      activities.data.comment = comment.data.content;
    }

    activities.data.date = new Date().toUTCString();
    activities.data.activeUserName = user.data.name;
    activities.data.activeUserPhotoURL = user.data.photoURL;
    activities.data.targetPid = pid;

    activities.data.type = activityType;

    await activities.saveSync();
  },

  async saveNotification(
    notificationType,
    activistUid,
    pid,
    fid?,
    comment?,
    projectRole?,
    invitationMessage?
  ) {
    const notification = Collections.notifications.create(Notification);
    notification.data.type = notificationType;

    if (fid !== null) {
      const file = await Collections.files.load(ProjectFile, fid);
      notification.data.fileName = file.data.name;
    }

    const project = await Collections.projects.load(Project, pid);

    const recipientUids = Object.keys(project.data.users).filter(key => {
      return activistUid !== key;
    });

    if (comment !== null) {
      const commentContent = await Collections.comments.load(
        Comment,
        comment.id
      );
      notification.data.comment = commentContent.data.content;
    }

    notification.data.activeUid = activistUid;
    notification.data.pid = pid;
    notification.data.recipientUid = recipientUids;
    if (projectRole !== null) {
      notification.data.projectRole = projectRole;
    }
    if (invitationMessage !== null) {
      notification.data.invitationMessage = invitationMessage;
    }
    notification.data.check = false;
    notification.save();
  }
};
