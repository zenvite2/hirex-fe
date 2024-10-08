import React from 'react';
import { useSelector } from 'react-redux';
import { HashLoader } from 'react-spinners';
import { RootState } from '../redux/store';

const Loading: React.FC = () => {
    const { isLoading } = useSelector((state: RootState) => state.loadingSlice);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <HashLoader
                size={80}
                color="green"
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
};

export default Loading;
