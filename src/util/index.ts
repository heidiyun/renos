import sha1 from 'sha1';
import ProjectFile from '@/models/projectFile';
import Collections from '@/models/collections';
import { Storage } from '@/vue-common';
import ActivityBoard from '@/models/activityBoard';
import ActivityType from '@/models/ActivityType';

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
      this.saveActivity(ActivityType.UPLOAD, uid, pid, projectFile.id, null);
    }
  },
  async saveActivity(activityType, uid, pid, fid?, comments?) {
    const activities = Collections.activityBoards.create(ActivityBoard);

    activities.data.activeUid = uid;
    activities.data.date = new Date().toUTCString();
    activities.data.targetPid = pid;
    activities.data.targetFid = fid;
    activities.data.type = activityType;
    if (comments !== null) {
      activities.data.comment = comments.id;
    }
    await activities.saveSync();
  }
};
