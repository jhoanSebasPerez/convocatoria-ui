"use client";

import { Box, CircularProgress } from '@mui/material';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

const PdfViewer = ({ url }: { url: string }) => {

    console.log(url);

    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return url ? (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11/build/pdf.worker.js">
            <div style={{ height: '100%' }}>
                <Viewer
                    fileUrl={url}
                    plugins={[
                        defaultLayoutPluginInstance,
                    ]}
                />
            </div>
        </Worker>
    ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, height: '100%' }}>
            <CircularProgress />
        </Box>
    );
};

export default PdfViewer;