/**
 * めぐるトイレ図鑑 & マップ - メインアプリケーションスクリプト
 */

// ストレージキー & Googleスプレッドシート(GAS)連携設定
const STORAGE_KEY = 'meguru_toilets_data_v3';

// ※Google Apps ScriptのWebアプリURL（スプレッドシート＆Googleドライブ自動保存）
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbwT1jlH3bsSxTmYdOLEBj8S_SzKKV93nzKhzRpB4FBfkt2KjEVKmZLnul9QC3KvZGbJ7A/exec'; 

let toilets = [];
let map = null;
let markers = {};
let currentCategoryFilter = 'all';
let currentUsageFilter = 'all';
let currentSearchQuery = '';
let currentTagFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  initData();
  initMap();
  renderSidebarList();
  initTipsView();
});

async function initData() {
  if (GAS_API_URL) {
    try {
      const res = await fetch(GAS_API_URL);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        toilets = data;
        saveToStorage();
        renderSidebarList();
        renderMarkers();
        initTipsView();
        return;
      }
    } catch (e) {
      console.warn('GAS fetch failed, falling back to local/default.', e);
    }
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      toilets = JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved toilets, resetting to defaults.', e);
      toilets = [...INITIAL_TOILETS];
    }
  } else {
    toilets = [...INITIAL_TOILETS];
    saveToStorage();
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toilets));
}

function initMap() {
  map = L.map('map', {
    zoomControl: true,
    scrollWheelZoom: true
  }).setView([35.8, 137.8], 7);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  renderMarkers();
}

function renderMarkers() {
  Object.values(markers).forEach(m => map.removeLayer(m));
  markers = {};

  const filtered = getFilteredToilets();

  filtered.forEach(item => {
    const iconHtml = `
      <div class="custom-map-pin">
        <span class="pin-inner-dot"></span>
      </div>
    `;

    const customIcon = L.divIcon({
      className: 'custom-leaflet-icon',
      html: iconHtml,
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      popupAnchor: [0, -26]
    });

    const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(map);

    const popupContent = `
      <div style="font-family: inherit; width: 220px; color: #111111;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <span style="font-size: 10px; background: rgba(90, 115, 67, 0.08); color: #5a7343; padding: 2px 6px; border-radius: 3px; font-weight: 500; border: 1px solid #5a7343;">${item.category}</span>
          <span style="font-size: 10px; color:#767676;">${item.verificationStatus || '確認済'}</span>
        </div>
        <h4 style="margin: 4px 0 3px; font-size: 13px; font-weight: 600; line-height: 1.35; color: #111111;">${item.title}</h4>
        <p style="font-size: 11px; color: #767676; margin: 0 0 6px;">${item.locationName}</p>
        <p style="font-size: 10px; color: #555; background: #f8faf6; padding: 4px 6px; border: 1px solid #e0e4dd; border-radius: 3px; margin: 0 0 8px; line-height: 1.3;">出典: ${item.source || '未記載'}</p>
        <button onclick="openDetailModal('${item.id}')" style="width: 100%; background: #111111; color: #ffffff; border: 1px solid #111111; padding: 6px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer; transition: background 0.15s;" onmouseover="this.style.background='#5a7343'" onmouseout="this.style.background='#111111'">詳細を表示</button>
      </div>
    `;
    marker.bindPopup(popupContent);

    markers[item.id] = marker;
  });

  document.getElementById('spot-count').textContent = filtered.length;
}

function renderSidebarList() {
  const container = document.getElementById('sidebar-cards-container');
  container.innerHTML = '';
  const filtered = getFilteredToilets();

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px 10px; color: #767676; font-size: 0.85rem;">
        <p>該当するトイレが見つかりませんでした。</p>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'spot-card';
    card.id = `card-${item.id}`;
    card.onclick = () => focusSpot(item.id);

  const defaultImg = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80";
  let thumbSrc = defaultImg;
  if (item.imageUrl) {
    if (item.imageUrl.startsWith('data:application/pdf')) {
      // PDFの場合はPDFプレースホルダー画像
      thumbSrc = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="84" height="84" fill="%235a7343" viewBox="0 0 16 16"><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 1.5 13 5h-3.5V1.5zM4.5 9h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1zm0 2h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z"/></svg>';
    } else {
      thumbSrc = item.imageUrl;
    }
  }

  card.innerHTML = `
    <img src="${thumbSrc}" alt="${item.title}" class="spot-card-thumb" onerror="this.src='${defaultImg}'">
      <div class="spot-card-info">
        <div class="spot-badge-row">
          <span class="badge-cat">${item.category}</span>
          ${item.verificationStatus ? `<span class="badge-source">${item.verificationStatus}</span>` : ''}
        </div>
        <h3 class="spot-card-title">${item.title}</h3>
        <p class="spot-card-loc">${item.locationName}</p>
        <p class="spot-card-summary">${item.summary || item.trouble}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function getFilteredToilets() {
  return toilets.filter(item => {
    // 方式フィルター
    const matchCat = (currentCategoryFilter === 'all') || (item.category === currentCategoryFilter);

    // 用途・設置場所フィルター
    let matchUsage = true;
    if (currentUsageFilter !== 'all') {
      const u = currentUsageFilter;
      const envText = (item.environment || '') + ' ' + (item.usageType || '') + ' ' + (item.title || '') + ' ' + (item.category || '');
      if (u === '常設') {
        matchUsage = envText.includes('常設') || envText.includes('家庭') || envText.includes('施設') || (!envText.includes('イベント') && !envText.includes('仮設'));
      } else if (u === '農園・自然農') {
        matchUsage = envText.includes('農園') || envText.includes('ファーム') || envText.includes('自然農') || item.categoryType === 'farm';
      } else if (u === '山岳・山小屋') {
        matchUsage = envText.includes('山岳') || envText.includes('山小屋') || envText.includes('標高') || item.categoryType === 'mountain';
      } else if (u === 'キャンプ場・宿泊') {
        matchUsage = envText.includes('キャンプ') || envText.includes('宿泊') || item.categoryType === 'camp';
      } else if (u === 'イベント・仮設') {
        matchUsage = envText.includes('イベント') || envText.includes('フェス') || envText.includes('仮設') || item.categoryType === 'event';
      }
    }

    // 検索語フィルター
    const q = currentSearchQuery.toLowerCase();
    const matchSearch = !q || (
      item.title.toLowerCase().includes(q) ||
      item.locationName.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.environment && item.environment.toLowerCase().includes(q)) ||
      (item.summary && item.summary.toLowerCase().includes(q)) ||
      (item.trouble && item.trouble.toLowerCase().includes(q)) ||
      (item.source && item.source.toLowerCase().includes(q)) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
    );
    return matchCat && matchUsage && matchSearch;
  });
}

function handleMapSearch() {
  currentSearchQuery = document.getElementById('map-search-input').value.trim();
  renderSidebarList();
  renderMarkers();
}

function filterUsageType(filterVal) {
  currentUsageFilter = filterVal;
  document.querySelectorAll('#usage-filter-chips .chip').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filterVal);
  });
  renderSidebarList();
  renderMarkers();
}

function filterMapCategory(cat) {
  currentCategoryFilter = cat;
  document.querySelectorAll('#category-filter-chips .chip').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });
  renderSidebarList();
  renderMarkers();
}

function focusSpot(id) {
  const item = toilets.find(t => t.id === id);
  if (!item) return;

  document.querySelectorAll('.spot-card').forEach(c => c.classList.remove('selected'));
  const targetCard = document.getElementById(`card-${id}`);
  if (targetCard) targetCard.classList.add('selected');

  if (markers[id] && map) {
    map.flyTo([item.lat, item.lng], 13, { duration: 1.0 });
    markers[id].openPopup();
  }
}

function switchView(viewName) {
  const mapView = document.getElementById('view-map');
  const tipsView = document.getElementById('view-tips');
  const mapBtn = document.getElementById('tab-map-btn');
  const tipsBtn = document.getElementById('tab-tips-btn');

  if (viewName === 'map') {
    mapView.classList.add('active');
    tipsView.classList.remove('active');
    mapBtn.classList.add('active');
    mapBtn.setAttribute('aria-selected', 'true');
    tipsBtn.classList.remove('active');
    tipsBtn.setAttribute('aria-selected', 'false');
    setTimeout(() => { if (map) map.invalidateSize(); }, 200);
  } else {
    mapView.classList.remove('active');
    tipsView.classList.add('active');
    mapBtn.classList.remove('active');
    mapBtn.setAttribute('aria-selected', 'false');
    tipsBtn.classList.add('active');
    tipsBtn.setAttribute('aria-selected', 'true');
    renderTipsGrid();
  }
}

function initTipsView() {
  const allTags = new Set();
  toilets.forEach(t => {
    if (t.tags) t.tags.forEach(tag => allTags.add(tag));
  });

  const tagContainer = document.getElementById('tips-tag-filters');
  tagContainer.innerHTML = `<button class="tag-btn active" data-tag="all" onclick="filterTipsTag('all')">すべて (${toilets.length})</button>`;

  allTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'tag-btn';
    btn.dataset.tag = tag;
    btn.textContent = tag;
    btn.onclick = () => filterTipsTag(tag);
    tagContainer.appendChild(btn);
  });

  renderTipsGrid();
}

function filterTipsTag(tag) {
  currentTagFilter = tag;
  document.querySelectorAll('#tips-tag-filters .tag-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tag === tag);
  });
  renderTipsGrid();
}

function renderTipsGrid() {
  const container = document.getElementById('tips-grid-container');
  container.innerHTML = '';

  const filtered = toilets.filter(t => {
    if (currentTagFilter === 'all') return true;
    return t.tags && t.tags.includes(currentTagFilter);
  });

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'tip-card';
    card.onclick = () => openDetailModal(item.id);

    const tagsHtml = (item.tags || []).map(tag => `<span class="tag-badge">${tag}</span>`).join(' ');

    card.innerHTML = `
      <div class="tip-card-header">
        <span class="badge-cat">${item.category}</span>
        <span style="font-size: 11px; color: #767676;">${item.locationName}</span>
      </div>
      <h3 class="tip-card-title">${item.summary || item.title}</h3>
      
      <div class="tip-section-box">
        <div class="label">困りごと・現場の課題</div>
        <div class="text">${item.trouble}</div>
      </div>

      <div class="tip-section-box solution">
        <div class="label">工夫・対応策</div>
        <div class="text">${item.action || '現在検証中'}</div>
      </div>

      <div class="tip-tags-row">
        ${tagsHtml}
      </div>

      <div class="tip-footer">
        <span>出典: ${item.source ? (item.source.length > 25 ? item.source.slice(0, 25) + '...' : item.source) : '未記載'}</span>
        <a href="javascript:void(0)" class="btn-link-map" onclick="event.stopPropagation(); jumpToMapSpot('${item.id}')">
          地図で表示
        </a>
      </div>
    `;
    container.appendChild(card);
  });
}

function jumpToMapSpot(id) {
  switchView('map');
  setTimeout(() => {
    focusSpot(id);
  }, 250);
}

function openDetailModal(id) {
  const item = toilets.find(t => t.id === id);
  if (!item) return;

  const modal = document.getElementById('detail-modal');
  const body = document.getElementById('detail-modal-body');

  const defaultImg = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80";
  const isPdf = item.imageUrl && item.imageUrl.startsWith('data:application/pdf');

  let mediaHtml = '';
  if (isPdf) {
    mediaHtml = `
      <div style="background:#f8faf6; border-bottom:1px solid rgba(0,0,0,0.16); padding:24px; text-align:center;">
        <p style="font-size:1rem; font-weight:600; color:#111; margin-bottom:8px;">📄 添付PDF資料</p>
        <a href="${item.imageUrl}" download="${item.title}_資料.pdf" class="btn btn-community" style="font-size:0.85rem; padding:8px 16px;">PDFをダウンロード・閲覧する</a>
      </div>
    `;
  } else {
    mediaHtml = `<img src="${item.imageUrl || defaultImg}" alt="${item.title}" class="detail-hero-img" onerror="this.src='${defaultImg}'">`;
  }

  const tagsHtml = (item.tags || []).map(tag => `<span class="tag-badge">${tag}</span>`).join(' ');

  const prac = item.practitioner || {
    name: "実践者",
    role: "施設管理者",
    bio: "",
    contactLabel: "連絡先を見る",
    contactUrl: "#"
  };

  const contrib = item.contributor || {
    name: "コミュニティ登録者",
    contact: "Discordにて確認可能",
    note: "登録データ"
  };

  body.innerHTML = `
    ${mediaHtml}
    <div class="detail-content">
      <div class="detail-top-meta">
        <div>
          <span class="badge-cat">${item.category}</span>
          <h2 class="detail-title" style="margin-top: 6px;">${item.title}</h2>
          <div class="detail-sub-info">
            <span>所在地: ${item.locationName}</span>
            <span>更新日: ${item.updatedAt || '-'}</span>
            <span>管理ID: ${item.id}</span>
            <span>公開範囲: ${item.status || '公開可能'}</span>
          </div>
        </div>
        <button class="btn btn-community-sub" onclick="openEditModal('${item.id}')" style="padding: 5px 12px; font-size: 0.78rem; white-space: nowrap; margin-top: 4px;">
          内容を編集する
        </button>
      </div>

      <div class="tip-tags-row">
        ${tagsHtml}
      </div>

      <div class="detail-grid-box">
        <div class="detail-block trouble-block">
          <h4>困りごと・現場の課題</h4>
          <p>${item.trouble}</p>
        </div>

        <div class="detail-block solution-block">
          <h4>実施した工夫・対応策</h4>
          <p>${item.action || '特になし・経過観察'}</p>
        </div>

        ${item.result ? `
        <div class="detail-block">
          <h4>対応後の変化・結果</h4>
          <p>${item.result}</p>
        </div>
        ` : ''}

        <!-- 参考文献・出典ブロック（リンク対応） -->
        <div class="detail-block source-block">
          <h4>参考文献・情報の出典</h4>
          <p>
            <strong>出典・根拠:</strong> 
            ${item.sourceUrl ? `<a href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer" style="color:#5a7343; text-decoration:underline; font-weight:600;">${item.source || item.sourceUrl}</a>` : (item.source || '未記載')}
          </p>
          <p style="font-size: 0.8rem; color: #666; margin-top: 4px;"><strong>確認区分:</strong> ${item.verificationStatus || '未確認'}</p>
        </div>

        ${item.unresolvedQuestion ? `
        <div class="detail-block">
          <h4>未解決の問い・検証課題</h4>
          <p>${item.unresolvedQuestion}</p>
        </div>
        ` : ''}
      </div>

      <dl class="detail-env-list">
        <dt>設置環境・基材・利用条件</dt>
        <dd>${item.environment || '未記入'}</dd>
      </dl>

      <!-- 記録者情報（コミュニケーションの担保） -->
      <div class="detail-block" style="background:#ffffff; border-color: rgba(0,0,0,0.16);">
        <h4 style="color:#111111;">この事例の記録者（ヒアリング・事実確認用）</h4>
        <p style="font-size: 0.85rem; color:#333;">記録者: <strong>${contrib.name}</strong> （連絡先: ${contrib.contact}）</p>
        ${contrib.note ? `<p style="font-size: 0.8rem; color:#666; margin-top:2px;">メモ: ${contrib.note}</p>` : ''}
      </div>

      <!-- 実践者と繋がる門 -->
      <div class="practitioner-gate-box">
        <h4>実践者と繋がる門</h4>
        <div class="role"><strong>${prac.name}</strong>（${prac.role || '実践者'}）</div>
        <p class="bio">${prac.bio || ''}</p>
        ${prac.communityNote ? `<p style="font-size: 0.8rem; color: #5a7343; margin-bottom: 10px;">${prac.communityNote}</p>` : ''}
        <div class="practitioner-actions">
          <a href="${prac.contactUrl || '#'}" target="_blank" class="btn btn-contact">
            ${prac.contactLabel || '実践者のページ・連絡先'}
          </a>
          <a href="https://discord.gg/fWmv6EbXS" target="_blank" rel="noopener noreferrer" class="btn btn-community">
            コミュニティDiscordで対話する
          </a>
          <a href="https://www.facebook.com/groups/3056220634712109/" target="_blank" rel="noopener noreferrer" class="btn btn-community-sub">
            Facebookグループ
          </a>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function closeDetailModal() {
  document.getElementById('detail-modal').classList.remove('active');
}

function handleModalBackdropClick(e) {
  if (e.target.id === 'detail-modal') {
    closeDetailModal();
  }
}

// 選択中のファイルオブジェクト（アップロード待ち）
let selectedFileObject = null;

/**
 * クライアント側（ブラウザ）での強力自動画像圧縮処理
 * - 長辺を最大1280pxにリサイズ（スマホ・PC画面で十二分に鮮明なサイズ）
 * - JPEG品質75%で強力圧縮し、容量を50KB〜150KB前後（元サイズの約1/20〜1/40）に激減
 * - これによりGoogleドライブ15GB枠で「10万枚以上」保存可能になります
 * - PDFは圧縮せずそのまま返却
 */
async function compressImageIfNeeded(file) {
  if (file.type === 'application/pdf') {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDimension = 1280; // 高解像度かつ軽量な最適値
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.75 // 75%品質（視覚的な美しさを保ちつつ極限まで軽量化）
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

// ファイルをBase64文字列に変換する関数
function readFileAsDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

// ファイル（画像・PDF）選択ハンドラー
async function handleFileSelected(e) {
  const rawFile = e.target.files[0];
  if (!rawFile) return;

  const isPdf = rawFile.type === 'application/pdf';
  const isImg = rawFile.type.startsWith('image/');

  if (!isPdf && !isImg) {
    alert('JPG、PNG画像、またはPDFファイルを選択してください。');
    e.target.value = '';
    return;
  }

  // 1ファイルあたり10MB上限チェック
  if (rawFile.size > 10 * 1024 * 1024) {
    alert('ファイルサイズの上限（10MB）を超えています。10MB以下のファイルを選択してください。');
    e.target.value = '';
    return;
  }

  const statusEl = document.getElementById('file-compression-status');
  if (statusEl) statusEl.textContent = isImg ? '画像を最適化中...' : '';

  // 画像の場合はブラウザ側で自動リサイズ＆圧縮
  const fileToUse = await compressImageIfNeeded(rawFile);
  selectedFileObject = fileToUse;

  if (statusEl && isImg) {
    const origMb = (rawFile.size / (1024 * 1024)).toFixed(2);
    const compKb = Math.round(fileToUse.size / 1024);
    statusEl.textContent = `最適化完了: ${origMb}MB → ${compKb}KB`;
  }

  // プレビュー表示用
  const reader = new FileReader();
  reader.onload = function(evt) {
    const dataUrl = evt.target.result;
    // Worker未設定時のプレビュー・一時保持用
    document.getElementById('f-image').value = dataUrl;

    const previewArea = document.getElementById('file-preview-area');
    const previewImg = document.getElementById('file-preview-img');
    const previewPdf = document.getElementById('file-preview-pdf');

    previewArea.style.display = 'flex';
    if (isImg) {
      previewImg.src = dataUrl;
      previewImg.style.display = 'block';
      previewPdf.style.display = 'none';
    } else {
      previewImg.style.display = 'none';
      previewPdf.style.display = 'block';
    }
  };
  reader.readAsDataURL(fileToUse);
}

function clearSelectedFile() {
  selectedFileObject = null;
  document.getElementById('f-file').value = '';
  document.getElementById('f-image').value = '';
  document.getElementById('file-preview-area').style.display = 'none';
  const statusEl = document.getElementById('file-compression-status');
  if (statusEl) statusEl.textContent = '';
}

function openAddModal() {
  clearSelectedFile();
  document.getElementById('f-edit-id').value = '';
  document.getElementById('add-toilet-form').reset();
  document.getElementById('form-modal-title').textContent = '訪ねたトイレを記録する';
  document.getElementById('form-modal-desc').innerHTML = '見学先や訪問先で記録したトイレ情報を登録できます。<br>情報の信頼性を担保するため、<strong>参考文献・出典</strong>および<strong>記録者への連絡先</strong>の入力をお願いしています。';
  document.getElementById('form-submit-btn').textContent = '確認して登録する';
  document.getElementById('add-modal').classList.add('active');
}

function openEditModal(id) {
  const item = toilets.find(t => t.id === id);
  if (!item) return;

  closeDetailModal();

  document.getElementById('f-edit-id').value = item.id;
  document.getElementById('form-modal-title').textContent = `「${item.title}」の文章・情報を編集する`;
  document.getElementById('form-modal-desc').textContent = '登録済みの文章や出典、連絡先などの情報を修正・更新できます。';
  document.getElementById('form-submit-btn').textContent = '変更を保存する';

  document.getElementById('f-title').value = item.title || '';
  document.getElementById('f-type').value = item.category || '手動攪拌式';
  if (document.getElementById('f-usage-type')) {
    document.getElementById('f-usage-type').value = item.usageType || (item.categoryType === 'mountain' ? '山岳・山小屋' : (item.categoryType === 'camp' ? 'キャンプ場・宿泊' : (item.categoryType === 'event' ? 'イベント・仮設' : '農園・自然農')));
  }
  document.getElementById('f-location-name').value = item.locationName || '';
  document.getElementById('f-lat').value = item.lat || '';
  document.getElementById('f-lng').value = item.lng || '';
  document.getElementById('f-image').value = item.imageUrl || '';
  document.getElementById('f-file').value = '';
  
  const previewArea = document.getElementById('file-preview-area');
  const previewImg = document.getElementById('file-preview-img');
  const previewPdf = document.getElementById('file-preview-pdf');
  if (item.imageUrl) {
    previewArea.style.display = 'flex';
    if (item.imageUrl.startsWith('data:application/pdf')) {
      previewImg.style.display = 'none';
      previewPdf.style.display = 'block';
    } else {
      previewImg.src = item.imageUrl;
      previewImg.style.display = 'block';
      previewPdf.style.display = 'none';
    }
  } else {
    previewArea.style.display = 'none';
  }

  document.getElementById('f-trouble').value = item.trouble || '';
  document.getElementById('f-action').value = item.action || '';
  document.getElementById('f-condition').value = item.environment || '';
  document.getElementById('f-tags').value = (item.tags || []).join(', ');
  document.getElementById('f-source').value = item.source || '';
  document.getElementById('f-verification').value = item.verificationStatus || '公開資料で確認済み';
  document.getElementById('f-status').value = item.status || '公開可能';
  document.getElementById('f-contributor-name').value = item.contributor?.name || '';
  document.getElementById('f-contributor-contact').value = item.contributor?.contact || '';
  document.getElementById('f-practitioner').value = item.practitioner?.name || '';
  document.getElementById('f-contact').value = item.practitioner?.contactUrl || '';

  document.getElementById('add-modal').classList.add('active');
}

function closeAddModal() {
  document.getElementById('add-modal').classList.remove('active');
}

function handleAddModalBackdropClick(e) {
  if (e.target.id === 'add-modal') {
    closeAddModal();
  }
}

function getCurrentLocation() {
  if (!navigator.geolocation) {
    alert('お使いのブラウザは位置情報取得に対応していません。手動でご入力ください。');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      document.getElementById('f-lat').value = pos.coords.latitude.toFixed(5);
      document.getElementById('f-lng').value = pos.coords.longitude.toFixed(5);
    },
    err => {
      alert('位置情報の取得に失敗しました。手動で入力してください。');
      console.warn(err);
    }
  );
}

async function handleSaveToiletForm(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('form-submit-btn');
  const originalBtnText = submitBtn.textContent;

  const editId = document.getElementById('f-edit-id').value;
  const title = document.getElementById('f-title').value.trim();
  const category = document.getElementById('f-type').value;
  const usageType = document.getElementById('f-usage-type') ? document.getElementById('f-usage-type').value : '農園・自然農';
  const locationName = document.getElementById('f-location-name').value.trim();
  const lat = parseFloat(document.getElementById('f-lat').value);
  const lng = parseFloat(document.getElementById('f-lng').value);
  let imageUrl = document.getElementById('f-image').value.trim();
  
  const trouble = document.getElementById('f-trouble').value.trim();
  const action = document.getElementById('f-action').value.trim();
  const environment = document.getElementById('f-condition').value.trim();
  const tagsStr = document.getElementById('f-tags').value.trim();

  // 参考文献と確認区分
  const source = document.getElementById('f-source').value.trim();
  const verificationStatus = document.getElementById('f-verification').value;
  const status = document.getElementById('f-status').value;

  // 記録者情報
  const contributorName = document.getElementById('f-contributor-name').value.trim();
  const contributorContact = document.getElementById('f-contributor-contact').value.trim();

  // 実践者情報
  const practitionerName = document.getElementById('f-practitioner').value.trim();
  const contact = document.getElementById('f-contact').value.trim();

  if (!source) {
    alert('参考文献・情報の出典の入力は必須です。');
    document.getElementById('f-source').focus();
    return;
  }

  if (!contributorContact) {
    alert('記録者への連絡先の入力は必須です。');
    document.getElementById('f-contributor-contact').focus();
    return;
  }

  // ファイルが選択されている場合、Base64データを送信準備
  let fileDataToSend = null;
  if (selectedFileObject) {
    submitBtn.disabled = true;
    submitBtn.textContent = '保存中...';
    fileDataToSend = await readFileAsDataUrl(selectedFileObject);
  }

  const tags = tagsStr ? tagsStr.split(/[,、\s]+/).filter(Boolean) : [];
  const todayStr = new Date().toISOString().split('T')[0];

  if (editId) {
    // 既存データの更新
    const idx = toilets.findIndex(t => t.id === editId);
    if (idx !== -1) {
      const updatedItem = {
        ...toilets[idx],
        title,
        category,
        usageType,
        locationName,
        lat,
        lng,
        imageUrl: imageUrl || toilets[idx].imageUrl,
        summary: trouble.slice(0, 45) + (trouble.length > 45 ? '...' : ''),
        trouble,
        action,
        environment,
        source,
        sourceUrl: source.startsWith('http') ? source : toilets[idx].sourceUrl,
        verificationStatus,
        tags: tags.length > 0 ? tags : toilets[idx].tags,
        contributor: {
          name: contributorName || toilets[idx].contributor?.name,
          contact: contributorContact || toilets[idx].contributor?.contact,
          note: toilets[idx].contributor?.note || "Web画面より更新"
        },
        practitioner: {
          ...toilets[idx].practitioner,
          name: practitionerName || toilets[idx].practitioner?.name,
          contactUrl: contact || toilets[idx].practitioner?.contactUrl
        },
        updatedAt: todayStr,
        status,
        fileData: fileDataToSend // Googleドライブ保存用
      };

      toilets[idx] = updatedItem;
      saveToStorage();

      if (GAS_API_URL) {
        fetch(GAS_API_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedItem)
        }).catch(err => console.warn('GAS POST error', err));
      }

      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      closeAddModal();
      renderSidebarList();
      renderMarkers();
      initTipsView();

      alert(`「${title}」の文章・情報を更新しました！`);
      setTimeout(() => {
        openDetailModal(editId);
      }, 200);
      return;
    }
  }

  // 新規登録
  const newId = `EX-${String(toilets.length + 1).padStart(3, '0')}`;
  const newToilet = {
    id: newId,
    title,
    category,
    usageType,
    categoryType: usageType === '山岳・山小屋' ? 'mountain' : (usageType === 'イベント・仮設' ? 'event' : (usageType === 'キャンプ場・宿泊' ? 'camp' : 'farm')),
    locationName,
    lat,
    lng,
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
    summary: trouble.slice(0, 45) + (trouble.length > 45 ? '...' : ''),
    trouble,
    action,
    result: "新規登録事例（コミュニティにて検証・対話中）",
    environment,
    source,
    sourceUrl: source.startsWith('http') ? source : "",
    verificationStatus,
    tags: tags.length > 0 ? tags : ["新規記録"],
    unresolvedQuestion: "",
    contributor: {
      name: contributorName,
      contact: contributorContact,
      note: "Web登録フォームより追加"
    },
    practitioner: {
      name: practitionerName || contributorName,
      role: "実践者 / 訪問者",
      bio: "現地を訪ねて記録・情報共有いただきました。",
      contactUrl: contact || "https://www.facebook.com/groups/3056220634712109/",
      contactLabel: contact ? "リンクを見る" : "コミュニティでコンタクト",
      communityNote: "質問・対話はコミュニティまで"
    },
    updatedAt: todayStr,
    status,
    fileData: fileDataToSend // Googleドライブ保存用
  };

  toilets.unshift(newToilet);
  saveToStorage();

  if (GAS_API_URL) {
    fetch(GAS_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newToilet)
    }).catch(err => console.warn('GAS POST error', err));
  }

  submitBtn.disabled = false;
  submitBtn.textContent = originalBtnText;

  document.getElementById('add-toilet-form').reset();
  closeAddModal();

  renderSidebarList();
  renderMarkers();
  initTipsView();

  alert(`「${title}」の記録を登録しました！`);

  switchView('map');
  setTimeout(() => {
    focusSpot(newId);
  }, 300);
}
