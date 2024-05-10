import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.js';
import { getAllUploadedImagesController, getFilteredImagesController, uploadController } from '../controllers/image.controller.js';

const router = Router()

router.use(isAuthenticated)

router.post('/upload', upload.single('image'), uploadController)

router.get('/all', getAllUploadedImagesController)

router.get('/search/:name', getFilteredImagesController)

export default router;