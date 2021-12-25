import Quagga from 'quagga';
import { Box } from '@/Types';

export interface CodeResult {
    code: string;
    box?: Box[];
}

export function decode(img: HTMLImageElement): Promise<CodeResult> {
    return new Promise((resolve) => {
        Quagga.decodeSingle({
            decoder: {
                readers: ["ean_reader"] // List of active readers
            },
            locate: true, // try to locate the barcode in the image
            src: img.src, // or 'data:image/jpg;base64,' + data
        }, (result) => {
            console.log('result→→→→', result);
            const rslt: CodeResult = {
                code: '',
            };

            if (!result) {
                resolve(rslt);
                return;
            }

            if (result.codeResult) {
                const codeResult = result.codeResult;
                rslt.code = codeResult.code || '';
            }

            if (result.boxes) {
                rslt.box = result.boxes;
            }

            resolve(rslt);
        });
    });
}
