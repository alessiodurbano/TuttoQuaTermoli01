import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { env } from '../lib/env.js';

const uploadDir = path.resolve(env.uploadDir);
fs.mkdirSync(uploadDir, { recursive: true });

const ALLOWED = new Map<string, string>([
  ['application/pdf', '.pdf'],
  ['application/msword', '.doc'],
  ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.docx'],
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    // Nome casuale: il nome originale (che spesso contiene nome e cognome del
    // candidato) resta solo nel database, non sul filesystem.
    const ext = ALLOWED.get(file.mimetype) ?? path.extname(file.originalname).slice(0, 10);
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const uploadCv = multer({
  storage,
  limits: { fileSize: env.maxCvSizeBytes, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'cv'));
      return;
    }
    cb(null, true);
  },
}).single('cv');

/** Wrapper che traduce gli errori di multer in messaggi in italiano. */
export function handleCvUpload(req: Request, res: Response, next: NextFunction): void {
  uploadCv(req, res, (error: unknown) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        res.status(413).json({
          error: `Il CV supera il limite di ${Math.round(env.maxCvSizeBytes / 1024 / 1024)} MB.`,
        });
        return;
      }
      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        res.status(415).json({ error: 'Formato non ammesso. Carica un file PDF, DOC o DOCX.' });
        return;
      }
    }

    res.status(400).json({ error: 'Caricamento del CV non riuscito.' });
  });
}

export const cvDirectory = uploadDir;
