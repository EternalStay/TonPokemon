function loadImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

function wrapText(ctx, text, x, y, maxW, lineH, align) {
  const words = text.split(' ');
  let line = '';
  ctx.textAlign = align || 'left';
  words.forEach((word, i) => {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxW && i > 0) {
      ctx.fillText(line.trim(), x, y);
      line = word + ' ';
      y += lineH;
    } else {
      line = test;
    }
  });
  ctx.fillText(line.trim(), x, y);
}

async function exportCard() {
  if (!currentPoke) return;
  const btn = document.getElementById('btn-save');
  btn.textContent = '...';
  btn.disabled = true;

  const W = 640, H = 920, M = 44;
  const canvas = document.getElementById('export-canvas');
  canvas.width  = W * 2;
  canvas.height = H * 2;
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  const fb = new FontFace('Bebas Neue', 'url(https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXooxW5rygbi49c.woff2)');
  const fd = new FontFace('DM Sans',    'url(https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8Cmcqbu6-K6z9mXgjU0.woff2)');
  await Promise.allSettled([fb.load(), fd.load()]);
  document.fonts.add(fb);
  document.fonts.add(fd);

  const sprite = await loadImage(currentPoke.sprite);
  const { top, worst } = getAffinities(currentPoke);
  const topImgs   = await Promise.all(top.slice(0, 5).map(p => loadImage(p.sprite)));
  const worstImgs = await Promise.all(worst.slice(0, 5).map(p => loadImage(p.sprite)));

  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, '#D62828');
  grad.addColorStop(1, '#F77F00');

  // Background — light
  ctx.fillStyle = '#F5F0E8';
  ctx.fillRect(0, 0, W, H);

  // Subtle grid
  ctx.strokeStyle = 'rgba(0,0,0,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // Top bar
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, 4);

  // Dark header block
  ctx.fillStyle = '#0D0D0D';
  roundRect(ctx, M, 20, W - M * 2, 320, 12);

  // Pseudo label
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '10px "DM Sans"';
  ctx.letterSpacing = '3px';
  ctx.textAlign = 'center';
  ctx.fillText('LE POKÉMON DE', W / 2, 50);

  ctx.fillStyle = '#FCBF49';
  ctx.font = 'bold 42px "Bebas Neue"';
  ctx.letterSpacing = '4px';
  ctx.fillText(currentPseudo.toUpperCase(), W / 2, 88);

  // Sprite
  if (sprite) {
    ctx.save();
    ctx.shadowColor = 'rgba(214,40,40,0.35)';
    ctx.shadowBlur  = 32;
    ctx.drawImage(sprite, W / 2 - 80, 96, 160, 160);
    ctx.restore();
  }

  // Pokemon name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 48px "Bebas Neue"';
  ctx.letterSpacing = '2px';
  ctx.textAlign = 'center';
  ctx.fillText(pokeName(currentPoke).toUpperCase(), W / 2, 284);

  // Types
  const typeColors = { normal:'#A8A77A',fire:'#EE8130',water:'#6390F0',electric:'#C8A800',grass:'#7AC74C',ice:'#7BBFBA',fighting:'#C22E28',poison:'#A33EA1',ground:'#B89128',flying:'#8B73D4',psychic:'#F95587',bug:'#8B9A10',rock:'#978A20',ghost:'#735797',dragon:'#6F35FC',dark:'#705746',steel:'#8C8CAE',fairy:'#D685AD' };
  const pillW = 76, pillH = 20, pillGap = 8;
  let px = W / 2 - (currentPoke.types.length * pillW + (currentPoke.types.length - 1) * pillGap) / 2;
  currentPoke.types.forEach(t => {
    ctx.fillStyle = typeColors[t] || '#888';
    roundRect(ctx, px, 294, pillW, pillH, 10);
    ctx.fillStyle = '#fff';
    ctx.font = '9px "DM Sans"';
    ctx.letterSpacing = '1px';
    ctx.textAlign = 'center';
    ctx.fillText(typeName(t).toUpperCase(), px + pillW / 2, 308);
    px += pillW + pillGap;
  });

  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.font = '10px "DM Sans"';
  ctx.letterSpacing = '2px';
  ctx.textAlign = 'center';
  ctx.fillText(`Gén. ${currentPoke.gen}  ·  #${currentPoke.id}  ·  BST ${currentPoke.bst}`, W / 2, 328);

  // Archetype strip
  ctx.fillStyle = '#D62828';
  roundRect(ctx, M, 356, W - M * 2, 70, 8);

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '9px "DM Sans"';
  ctx.letterSpacing = '3px';
  ctx.textAlign = 'left';
  ctx.fillText('TON ARCHÉTYPE', M + 16, 374);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px "Bebas Neue"';
  ctx.letterSpacing = '2px';
  ctx.fillText(pokeArch(currentPoke).toUpperCase(), M + 16, 400);

  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = 'italic 11px "DM Sans"';
  ctx.letterSpacing = '0px';
  ctx.textAlign = 'right';
  wrapText(ctx, LANG.ARCH_DESC[currentPoke.arch] || '', W - M - 16, 382, 240, 16, 'right');

  // Stats section
  const barX  = M + 100 + 8;
  const barW  = W - M - 36 - 8 - barX;
  const statLabels = [LANG.puissance, LANG.gabarit, LANG.agres, LANG.vitesse, LANG.solidite];
  const statColors = [['#D62828','#F77F00'],['#003049','#0077B6'],['#9B2226','#D62828'],['#F4A261','#E76F51'],['#6A994E','#A7C957']];

  let sy = 450;
  currentPoke.v.forEach((val, i) => {
    ctx.fillStyle = '#555';
    ctx.font = '9px "DM Sans"';
    ctx.letterSpacing = '1px';
    ctx.textAlign = 'left';
    ctx.fillText(statLabels[i].toUpperCase(), M, sy + 5);

    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    roundRect(ctx, barX, sy - 1, barW, 6, 3);

    const g = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    g.addColorStop(0, statColors[i][0]);
    g.addColorStop(1, statColors[i][1]);
    ctx.fillStyle = g;
    roundRect(ctx, barX, sy - 1, Math.max(4, barW * val / 100), 6, 3);

    ctx.fillStyle = '#0D0D0D';
    ctx.font = 'bold 11px "Bebas Neue"';
    ctx.letterSpacing = '1px';
    ctx.textAlign = 'right';
    ctx.fillText(val, W - M, sy + 5);
    sy += 24;
  });

  // Divider
  ctx.strokeStyle = 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(M, sy + 8); ctx.lineTo(W - M, sy + 8); ctx.stroke();
  sy += 24;

  // Affinities — two columns
  const colW = (W - M * 2 - 20) / 2;

  const drawAffinityCol = (items, imgs, startX, title) => {
    ctx.fillStyle = '#888';
    ctx.font = '9px "DM Sans"';
    ctx.letterSpacing = '2px';
    ctx.textAlign = 'left';
    ctx.fillText(title, startX, sy);

    let ry = sy + 14;
    items.slice(0, 5).forEach((p, i) => {
      const isFirst = i === 0;
      const rowH = isFirst ? 52 : 36;
      const imgSize = isFirst ? 44 : 30;

      if (isFirst) {
        ctx.fillStyle = 'rgba(214,40,40,0.06)';
        roundRect(ctx, startX - 4, ry - 4, colW + 4, rowH, 6);
      }

      if (imgs[i]) ctx.drawImage(imgs[i], startX, ry, imgSize, imgSize);

      ctx.fillStyle = isFirst ? '#D62828' : '#0D0D0D';
      ctx.font = `${isFirst ? 'bold ' : ''}${isFirst ? 12 : 10}px "Bebas Neue"`;
      ctx.letterSpacing = '0.5px';
      ctx.textAlign = 'left';
      const maxNameW = colW - imgSize - 8;
      const name = pokeName(p).toUpperCase();
      ctx.fillText(name, startX + imgSize + 8, ry + (isFirst ? 16 : 11));
      if (isFirst) {
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.font = '9px "DM Sans"';
        ctx.fillText(p.arch, startX + imgSize + 8, ry + 30);
      }

      ry += rowH + 4;
    });
  };

  drawAffinityCol(top,   topImgs,   M,           'ÂMES SŒURS');
  drawAffinityCol(worst, worstImgs, M + colW + 20, 'OPPOSÉS');

  // Footer
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.font = '9px "DM Sans"';
  ctx.letterSpacing = '2px';
  ctx.textAlign = 'center';
  ctx.fillText(CONFIG.siteName, W / 2, H - 14);

  ctx.fillStyle = grad;
  ctx.fillRect(0, H - 4, W, 4);

  const link = document.createElement('a');
  link.download = `pokemon-${currentPseudo.toLowerCase()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();

  btn.textContent = LANG.save;
  btn.disabled = false;
}
