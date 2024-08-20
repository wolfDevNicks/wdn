const chatContainer = document.getElementById('chat');
const messageInput = document.getElementById('messageInput');
const imageInput = document.getElementById('imageInput');
const sendBtn = document.getElementById('sendBtn');
const imagePreview = document.getElementById('imagePreview');
const removeImageBtn = document.getElementById('removeImageBtn');
const uploadImageBtn = document.getElementById('uploadImageBtn');

// 메시지를 localStorage에 저장하기 위한 키
const CHAT_STORAGE_KEY = 'chatMessages';

// 로컬 스토리지에서 채팅 데이터 로드
const loadMessages = () => {
    const messages = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY)) || [];
    return messages;
};

// 로컬 스토리지에 채팅 데이터 저장
const saveMessages = (messages) => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
};

// 메시지 전송
const sendMessage = () => {
    const messageText = messageInput.value;
    const imageFile = imageInput.files[0];
    const messages = loadMessages();

    let imageUrl = '';
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageUrl = e.target.result;
            addMessage(messages, messageText, imageUrl);
        };
        reader.readAsDataURL(imageFile);
    } else {
        addMessage(messages, messageText, imageUrl);
    }
};

// 메시지 추가
const addMessage = (messages, messageText, imageUrl) => {
    const newMessage = {
        id: Date.now(),
        text: messageText,
        imageUrl: imageUrl
    };
    messages.push(newMessage);
    saveMessages(messages);
    renderMessages();
    messageInput.value = '';  // 입력 필드 비우기
    imageInput.value = '';    // 파일 선택 초기화
    imagePreview.style.display = 'none'; // 이미지 전송 후 미리보기 숨김
    removeImageBtn.style.display = 'none'; // 이미지 삭제 버튼 숨김
};

// 메시지 삭제
const deleteMessage = (id) => {
    const messages = loadMessages();
    const updatedMessages = messages.filter(message => message.id !== id);
    saveMessages(updatedMessages);
    renderMessages();
};

// 메시지 수정
const editMessage = (id) => {
    const newMessageText = prompt("Edit your message:");
    if (newMessageText !== null) {
        const messages = loadMessages();
        const message = messages.find(message => message.id === id);
        message.text = newMessageText;
        saveMessages(messages);
        renderMessages();
    }
};

// 메시지 렌더링
const renderMessages = () => {
    const messages = loadMessages();
    chatContainer.innerHTML = '';
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.innerHTML = `<span>${message.text}</span>`;

        if (message.imageUrl) {
            const imgElement = document.createElement('img');
            imgElement.src = message.imageUrl;
            imgElement.alt = 'Uploaded image';
            messageContent.appendChild(imgElement);
        }

        const messageButtons = document.createElement('div');
        messageButtons.classList.add('message-buttons');
        messageButtons.innerHTML = `
            <button class="edit-btn" onclick="editMessage(${message.id})">Edit</button>
            <button class="delete-btn" onclick="deleteMessage(${message.id})">Delete</button>
        `;

        messageElement.appendChild(messageContent);
        messageElement.appendChild(messageButtons);
        chatContainer.appendChild(messageElement);
    });
};

// 페이지 로드 시 초기화
const init = () => {
    renderMessages();
    messageInput.value = '';  // 페이지 로드 시 입력 필드 비우기
    imagePreview.style.display = 'none'; // 페이지 로드 시 미리보기 숨김
    removeImageBtn.style.display = 'none'; // 페이지 로드 시 이미지 삭제 버튼 숨김
};

// 버튼 클릭 시 메시지 전송
sendBtn.addEventListener('click', sendMessage);

// 이미지 미리보기
imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            removeImageBtn.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = 'none';
        removeImageBtn.style.display = 'none';
    }
});

// 이미지 삭제 버튼 클릭 시
removeImageBtn.addEventListener('click', () => {
    imageInput.value = ''; // 파일 입력 필드 초기화
    imagePreview.style.display = 'none';
    removeImageBtn.style.display = 'none';
});

// 이미지 선택 버튼 클릭 시
uploadImageBtn.addEventListener('click', () => {
    imageInput.click();
});

// 페이지 로드 시 초기화 함수 호출
init();