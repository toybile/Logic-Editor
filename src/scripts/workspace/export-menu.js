(() => {
  const trigger = document.getElementById("download"),
    downloadText = trigger.onclick;
  const wrapper = document.createElement("div");
  wrapper.className = "hy-export-menu-wrap";
  trigger.before(wrapper);
  wrapper.append(trigger);
  const menu = document.createElement("div");
  menu.className = "hy-export-menu";
  menu.hidden = true;
  menu.id = "export-formats";
  menu.setAttribute("role", "group");
  menu.setAttribute("popover", "manual");
  menu.setAttribute("aria-label", "Formato");
  wrapper.append(menu);
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-controls", menu.id);
  function close() {
    if (menu.matches(":popover-open")) menu.hidePopover();
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  }
  function position() {
    if (menu.hidden) return;
    if (!trigger.getClientRects().length) { close(); return; }
    const b = trigger.getBoundingClientRect(), m = menu.getBoundingClientRect();
    menu.style.left = Math.max(12, Math.min(innerWidth - m.width - 12, b.left + b.width / 2 - m.width / 2)) + "px";
    menu.style.top = Math.max(12, b.top - m.height - 8 >= 12 ? b.top - m.height - 8 : b.bottom + 8) + "px";
  }
  function open() {
    menu.hidden = false;
    menu.showPopover();
    trigger.setAttribute("aria-expanded", "true");
    position();
  }
  function save(bytes, type = 'application/pdf', name = 'argumento.pdf') {
    const url = URL.createObjectURL(new Blob([bytes], { type })),
      link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function layoutArgument() {
    await document.fonts.ready;
    const canvas = document.createElement("canvas");
    canvas.width = 1240;
    const ctx = canvas.getContext("2d");
    ctx.font = '32px ' + getComputedStyle(preview).fontFamily;
    const lines = [];
    for (const original of argument().split("\n")) {
      let line = "";
      for (const char of original) {
        if (ctx.measureText(line + char).width > 1080 && line) {
          lines.push(line);
          line = "";
        }
        line += char;
      }
      lines.push(line);
    }
    return {canvas,ctx,lines};
  }
  function panelImageSource(panel) {
    const box = panel.getBoundingClientRect(), padding = 24;
    const width = Math.ceil(box.width + padding * 2), height = Math.ceil(box.height + padding * 2);
    const viewportUnits = value => value.replace(/(-?[\d.]+)(?:d|s|l)?v([wh])/g,
      (_,number,axis) => Number(number) * (axis === 'w' ? innerWidth : innerHeight) / 100 + 'px');
    function styles(source,target,pseudo) {
      const computed = getComputedStyle(source,pseudo);
      for (const name of computed) {
        if (name.startsWith('--') || /^(?:(?:inset|margin|padding|border)-(?:block|inline)|(?:min-|max-)?(?:block|inline)-size|overflow-(?:block|inline))/.test(name)) continue;
        target.style.setProperty(name,viewportUnits(computed.getPropertyValue(name)));
      }
      if (!pseudo && source.computedStyleMap) for (const side of ['top','right','bottom','left']) {
        if (String(source.computedStyleMap().get('margin-'+side)) === 'auto') target.style.setProperty('margin-'+side,'auto');
      }
      target.style.animation = 'none'; target.style.transition = 'none';
      return computed;
    }
    function clone(source) {
      if (source.nodeType !== Node.ELEMENT_NODE) return source.cloneNode(false);
      const target = source.cloneNode(false), computed = styles(source,target);
      if (computed.display === 'none' || source.matches('script,style,[popover]')) return null;
      function decoration(pseudo) {
        if (source.namespaceURI !== 'http://www.w3.org/1999/xhtml') return;
        const computed = getComputedStyle(source,pseudo);
        if (['none','normal'].includes(computed.content) || computed.display === 'none') return;
        const element = document.createElement('span'); styles(source,element,pseudo);
        if (computed.content.startsWith('"')) {
          try { element.textContent = JSON.parse(computed.content); } catch {}
        }
        target.append(element);
      }
      decoration('::before');
      for (const child of source.childNodes) { const copy = clone(child); if (copy) target.append(copy); }
      decoration('::after');
      if (source instanceof HTMLInputElement) target.setAttribute('value',source.value);
      if (source instanceof HTMLTextAreaElement) target.textContent = source.value;
      return target;
    }
    const scene = document.createElement('div');
    scene.setAttribute('xmlns','http://www.w3.org/1999/xhtml');
    Object.assign(scene.style,{position:'relative',width:width+'px',height:height+'px',overflow:'hidden',
      backgroundColor:getComputedStyle(document.body).backgroundColor});
    const ancestors = [];
    for(let element = panel.parentElement; element && root.contains(element); element = element.parentElement) ancestors.unshift(element);
    for(const ancestor of ancestors) {
      const computed = getComputedStyle(ancestor), bounds = ancestor.getBoundingClientRect(), layer = document.createElement('div');
      for(const name of ['background-color','background-image','background-position','background-size','background-repeat','background-origin','background-clip'])
        layer.style.setProperty(name,viewportUnits(computed.getPropertyValue(name)));
      Object.assign(layer.style,{position:'absolute',left:bounds.left-box.left+padding+'px',top:bounds.top-box.top+padding+'px',width:bounds.width+'px',height:bounds.height+'px'});
      if (computed.backgroundAttachment === 'fixed') {
        layer.style.backgroundSize = innerWidth+'px '+innerHeight+'px';
        layer.style.backgroundPosition = -bounds.left+'px '+(-bounds.top)+'px';
        layer.style.backgroundRepeat = 'no-repeat';
      }
      scene.append(layer);
    }
    const copy = clone(panel);
    Object.assign(copy.style,{position:'absolute',inset:'auto',left:padding+'px',top:padding+'px',margin:'0',alignSelf:'auto',justifySelf:'auto',
      width:box.width+'px',height:box.height+'px',minWidth:'0',minHeight:'0',maxWidth:'none',maxHeight:'none',
      boxSizing:'border-box',transform:'none',translate:'none',scale:'none'});
    scene.append(copy);
    const serialized = new XMLSerializer().serializeToString(scene);
    return {width,height,url:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'"><foreignObject width="100%" height="100%">'+serialized+'</foreignObject></svg>')};
  }
  async function png() {
    await document.fonts.ready;
    // Capture the enabled button, then restore the export lock before the browser paints.
    const disabled = trigger.disabled; let source;
    try { trigger.disabled = false; source = withArgumentPanelSnapshot(panelImageSource); }
    finally { trigger.disabled = disabled; }
    const image = new Image();
    await new Promise((resolve,reject) => { image.onload = resolve; image.onerror = reject; image.src = source.url; });
    const canvas = document.createElement('canvas'), scale = Math.max(2,devicePixelRatio || 1);
    canvas.width = Math.ceil(source.width * scale); canvas.height = Math.ceil(source.height * scale);
    canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve,'image/png'));
    if (!blob) throw new Error('PNG encoding failed');
    save(blob,'image/png','argumento.png');
  }
  async function pdf() {
    const {canvas,ctx,lines} = await layoutArgument();
    canvas.height = 1754;
    const pages = [];
    for (let offset = 0; offset < lines.length; offset += 30) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 1240, 1754);
      ctx.fillStyle = "#20242b";
      ctx.font = '32px ' + getComputedStyle(preview).fontFamily;
      lines.slice(offset, offset + 30).forEach((line, i) => ctx.fillText(line, 80, 110 + i * 50));
      pages.push(
        Uint8Array.from(atob(canvas.toDataURL("image/jpeg", 0.95).split(",")[1]), (c) =>
          c.charCodeAt(0),
        ),
      );
    }
    const encoder = new TextEncoder(),
      chunks = [],
      offsets = [0];
    let size = 0;
    const put = (data) => {
      const bytes = typeof data === "string" ? encoder.encode(data) : data;
      chunks.push(bytes);
      size += bytes.length;
    };
    const obj = (id, body) => {
      offsets[id] = size;
      put(id + " 0 obj\n");
      put(body);
      put("\nendobj\n");
    };
    put("%PDF-1.4\n");
    obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
    obj(
      2,
      "<< /Type /Pages /Count " +
        pages.length +
        " /Kids [" +
        pages.map((_, i) => 3 + i * 3 + " 0 R").join(" ") +
        "] >>",
    );
    pages.forEach((jpeg, i) => {
      const id = 3 + i * 3;
      obj(
        id,
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Image " +
          (id + 1) +
          " 0 R >> >> /Contents " +
          (id + 2) +
          " 0 R >>",
      );
      offsets[id + 1] = size;
      put(
        id +
          1 +
          " 0 obj\n<< /Type /XObject /Subtype /Image /Width 1240 /Height 1754 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " +
          jpeg.length +
          " >>\nstream\n",
      );
      put(jpeg);
      put("\nendstream\nendobj\n");
      const content = "q 595.28 0 0 841.89 0 0 cm /Image Do Q";
      obj(
        id + 2,
        "<< /Length " + encoder.encode(content).length + " >>\nstream\n" + content + "\nendstream",
      );
    });
    const xref = size;
    put("xref\n0 " + offsets.length + "\n0000000000 65535 f \n");
    offsets.slice(1).forEach((offset) => put(String(offset).padStart(10, "0") + " 00000 n \n"));
    put("trailer\n<< /Size " + offsets.length + " /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF");
    const result = new Uint8Array(size);
    let position = 0;
    for (const chunk of chunks) {
      result.set(chunk, position);
      position += chunk.length;
    }
    save(result);
  }
  for (const format of [".txt", ".pdf", ".png"]) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hy-button";
    button.textContent = format.slice(1).toUpperCase();
    button.setAttribute('aria-label',format);
    button.onclick = async () => {
      close();
      trigger.focus();
      if (format === ".txt") downloadText();
      else {
        trigger.disabled = true;
        try {
          if(format === '.png') await png(); else await pdf();
          const label = format.slice(1).toUpperCase();
          argumentNotice(interfaceText('Arquivo ' + label + ' gerado.', label + ' file generated.'));
        } finally {
          trigger.disabled = false;
        }
      }
    };
    menu.append(button);
  }
  trigger.onclick = () => {
    if (menu.hidden) open(); else close();
  };
  document.addEventListener("pointerdown", (event) => {
    if (!wrapper.contains(event.target)) close();
  });
  wrapper.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (menu.hidden) return;
      event.preventDefault();
      event.stopPropagation();
      close();
      trigger.focus();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      open();
      menu.querySelector("button").focus();
    }
  });
  window.addEventListener("resize", position);
  document.addEventListener("scroll", position, true);
  document.addEventListener("close", event => { if (event.target.matches("dialog")) close(); }, true);
})();
