declare module 'quagga' {
    type Box =  [
        [number, number],
        [number, number],
        [number, number],
        [number, number]
    ];

    type Source = string;

    interface Configuration {
            numOfWorkers: number;
            locate: boolean;
            inputStream: {
                name: string;
                type: 'LiveStream';
                target: HTMLVideoElement;
            };
            frequency: number;
            decoder: {
                readers : string[];
            };
            locator: {
                halfSample: boolean;
                patchSize: "medium", // x-small, small, medium, large, x-large
                debug: {
                    showCanvas: boolean;
                    showPatches: boolean;
                    showFoundPatches: boolean;
                    showSkeleton: boolean;
                    showLabels: boolean;
                    showPatchLabels: boolean;
                    showRemainingPatchLabels: boolean;
                    boxFromPatches: {
                        showTransformed: boolean;
                        showTransformedBox: boolean;
                        showBB: boolean;
                    };
                };
            };
            debug: boolean;
            src: Source;
    }

    interface ResultObject {
        'codeResult': {
            'code': string;  // the decoded code as a string
            'format': string; // code_128 or code_39, codabar, ean_13, ean_8, upc_a, upc_e
            'start': number;
            'end': number;
            'codeset': number;
            'startInfo': {
                'error': number;
                'code': number;
                'start': number;
                'end': number;
            },
            'decodedCodes': [{
                'code': number;
                'start': number;
                'end': number;
            },
            // stripped for brevity
            {
                'error': number;
                'code': number;
                'start': number;
                'end': number;
            }],
            'endInfo': {
                'error': number;
                'code': number;
                'start': number;
                'end': number;
            },
            'direction': number;
        },
        'line': Array<{
            'x': number;
            'y': number;
        }>;
        'angle': number;
        'pattern': Array<0 | 1>;
        'box': Box;
        'boxes': Array<Box>;
    }

    function decodeSingle(config: partial<Configuration>, cb: (result?: ResultObject) => void): void;
}
