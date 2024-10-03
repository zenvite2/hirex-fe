import React, { useState } from 'react'
import CustomModal from '../components/CustomModal';
import Messenger from './Messenger';

function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="p-4">
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => {
                    openModal();
                }}
            >
                Open Modal
            </button>

            <CustomModal isOpen={isModalOpen} onClose={closeModal} width='large' height='large'>
                <Messenger />
            </CustomModal>
        </div>
    );
};

export default Home;