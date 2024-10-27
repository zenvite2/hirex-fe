import React, { useState } from 'react'
import CustomModal from '../components/CustomModal';
import Messenger from './chat/Messenger';
import { useNavigate } from 'react-router-dom';

const wsUrl = process.env.REACT_APP_BASE_WS_URL;

function Home() {
    const [currentUser, setCurrentUser] = useState('')
    const currentChatFriend = '321'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const windowFeatures = `menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes,width=${window.screen.width},height=${window.screen.height}`;
    const navigate = useNavigate();

    return (
        <div className="p-4">
            <input type='text' value={currentUser} onChange={(e) => setCurrentUser(e.target.value)} />
            <button onClick={() => {
                navigate('/messenger', {
                    state: {
                        currentUser: currentUser
                    }
                })
            }}>
                messenger
            </button>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => {
                    window.open(wsUrl + "/video-call", "Video Call", windowFeatures)
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