document.getElementById('fileInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const arrayBuffer = await file.arrayBuffer();
    const dataView = new DataView(arrayBuffer);
  
    let offset = 16; // skip header
  
    const items = [];
    let current = {};
  
    while (offset < dataView.byteLength) {
      const key = new TextDecoder().decode(arrayBuffer.slice(offset, offset + 4));
      offset += 4;
  
      const len = dataView.getUint32(offset, true);
      offset += 4;
  
      const raw = arrayBuffer.slice(offset, offset + len);
      const value = new TextDecoder().decode(raw);
      offset += len;
  
      if (key === "iabi" && Object.keys(current).length > 0) {
        items.push(current);
        current = {};
      }
  
      current[key] = value.trim();
    }
  
    if (Object.keys(current).length > 0) items.push(current);
  
    // 렌더링
    const container = document.getElementById('itemListContainer');
    container.innerHTML = "";
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = "item-box";
      div.innerHTML = `
        <strong>${item.unam || "이름 없음"}</strong><br/>
        ${item.uspa || item.utip || "효과 없음"}
      `;
      container.appendChild(div);
    });
  });
  