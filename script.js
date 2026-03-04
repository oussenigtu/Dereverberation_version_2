async function loadMultiChannelAudio(filePath, ids) {

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    for (let i = 0; i < 4; i++) {

        const monoBuffer = audioContext.createBuffer(
            1,
            audioBuffer.length,
            audioBuffer.sampleRate
        );

        monoBuffer.copyToChannel(
            audioBuffer.getChannelData(i),
            0
        );

        const wavBlob = bufferToWave(monoBuffer);
        const url = URL.createObjectURL(wavBlob);

        document.getElementById(ids[i]).src = url;
    }
}

function bufferToWave(abuffer) {
    const numOfChan = abuffer.numberOfChannels,
    length = abuffer.length * numOfChan * 2 + 44,
    buffer = new ArrayBuffer(length),
    view = new DataView(buffer),
    channels = [],
    sampleRate = abuffer.sampleRate;

    let offset = 0;
    let pos = 0;

    function setUint16(data) { view.setUint16(pos, data, true); pos += 2; }
    function setUint32(data) { view.setUint32(pos, data, true); pos += 4; }

    setUint32(0x46464952);
    setUint32(length - 8);
    setUint32(0x45564157);

    setUint32(0x20746d66);
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(sampleRate);
    setUint32(sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);

    setUint32(0x61746164);
    setUint32(length - pos - 4);

    for (let i = 0; i < abuffer.numberOfChannels; i++)
        channels.push(abuffer.getChannelData(i));

    while (pos < length) {
        for (let i = 0; i < numOfChan; i++) {
            let sample = Math.max(-1, Math.min(1, channels[i][offset]));
            sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
            view.setInt16(pos, sample, true);
            pos += 2;
        }
        offset++;
    }

    return new Blob([buffer], { type: "audio/wav" });
}

loadMultiChannelAudio(
    "control/p234_001.wav",
    ["ch1_1", "ch1_2", "ch1_3","ch1_4"]
);
    loadMultiChannelAudio(
    "control/p234_002.wav",
    ["ch2_1", "ch2_2", "ch2_3","ch2_4"]
);
    loadMultiChannelAudio(
    "control/p234_003.wav",
    ["ch3_1", "ch3_2", "ch3_3","ch3_4"]
);
    loadMultiChannelAudio(
    "control/p237_002.wav",
    ["ch4_1", "ch4_2", "ch4_3","ch4_4"]
);