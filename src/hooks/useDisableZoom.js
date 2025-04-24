import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";

const useDisableZoom = () => {
    useEffect(() => {
        // Prevent zooming with Ctrl + Scroll
        const handleWheel = (event) => {
            if (event.ctrlKey) {
                enqueueSnackbar('Zoom In and Zoom Out is disabled', { variant: 'info', autoHideDuration: 3000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
                event.preventDefault();
            }
        };

        // Prevent zooming with Ctrl + (+/-)
        const handleKeyDown = (event) => {
            if (
                event.ctrlKey &&
                (event.key === "+" || event.key === "-" || event.key === "0")
            ) {
                enqueueSnackbar('Zoom In and Zoom Out is disabled', { variant: 'info', autoHideDuration: 3000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
                event.preventDefault();
            }
        };

        // Prevent pinch-to-zoom (for touch devices)
        const handleTouchMove = (event) => {
            if (event.touches.length > 1) {
                enqueueSnackbar('Zoom In and Zoom Out is disabled', { variant: 'info', autoHideDuration: 3000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
                event.preventDefault();
            }
        };

        // Add event listeners
        document.addEventListener("wheel", handleWheel, { passive: false });
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            // Cleanup event listeners
            document.removeEventListener("wheel", handleWheel);
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("touchmove", handleTouchMove);
        };
    }, []);
};

export default useDisableZoom;
