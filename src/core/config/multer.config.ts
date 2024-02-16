

import multer,{ memoryStorage }  from 'multer';
import path from 'path';


//multer memory storage
const uploadStorage = memoryStorage();

export const upload = multer({ storage: uploadStorage });


