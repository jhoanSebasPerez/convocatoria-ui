import { Button } from "@mui/material"
import { VscLoading } from "react-icons/vsc";

interface AnimatedButtonProps {
    readonly loading: boolean;
    readonly text: string;
}

export default function AnimatedButton({
    loading,
    text,
}: AnimatedButtonProps) {
    return (
        <>
            <Button
                variant="contained"
                type="submit"
                disabled={loading}
                startIcon={loading ? <VscLoading className="spinner" style={{ color: 'white' }} /> : null}
            >
                {loading ? '' : text}
            </Button>

            <style>
                {`
                .spinner {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
        </>
    );
}