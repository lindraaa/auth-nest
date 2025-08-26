import { diskStorage } from 'multer';
import { extname, basename } from 'path';
import * as fs from 'fs';

export const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const originalName = basename(
      file.originalname,
      extname(file.originalname),
    );
    const extension = extname(file.originalname);

    let filename = `${originalName}${extension}`;
    let counter = 1;

    // check if file already exists  increment
    while (fs.existsSync(`./uploads/${filename}`)) {
      filename = `${originalName}_${counter}${extension}`;
      counter++;
    }

    callback(null, filename);
  },
});
