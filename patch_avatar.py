import re

with open("index.html", "r") as f:
    html = f.read()

old_modal = r"""    <!-- Modal Pilih Avatar -->
    <div id="modal-pilih-avatar" class="modal-overlay">
        <div class="modal-content" style="max-width: 400px; text-align: center;">
            <button class="neo-btn bg-red close-btn" onclick="tutupModal\(\)" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>
            <h2 style="font-size: 1\.8rem; margin-bottom: 20px; color: var\(--color-dark\);">Pilih Avatar</h2>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;" id="avatar-options">
                <!-- Dijana oleh JS -->
            </div>
        </div>
    </div>"""

new_modal = """    <!-- Modal Pilih Avatar -->
    <div id="modal-pilih-avatar" class="modal-overlay">
        <div class="modal-content" style="max-width: 400px; text-align: center;">
            <button class="neo-btn bg-red close-btn" onclick="tutupModal()" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>
            <h2 style="font-size: 1.5rem; margin-bottom: 20px; color: var(--color-dark);">Edit Profil</h2>
            <div style="margin-bottom: 20px; text-align: left;">
                <label style="display: block; font-weight: bold; margin-bottom: 5px; color: var(--color-dark);">Nama Anda</label>
                <input type="text" id="edit-nama-input" class="neo-input" style="width: 100%; padding: 10px; border: 2px solid var(--color-dark); border-radius: 8px; font-size: 1.1rem; margin-bottom: 15px;" placeholder="Nama Anda" />
                <label style="display: block; font-weight: bold; margin-bottom: 5px; color: var(--color-dark);">Pilih Avatar</label>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;" id="avatar-options">
                    <!-- Dijana oleh JS -->
                </div>
            </div>
            <button class="neo-btn bg-green" style="width: 100%;" onclick="simpanProfilEdit()">Simpan Profil</button>
        </div>
    </div>"""

if re.search(old_modal, html):
    html = re.sub(old_modal, new_modal, html)
    with open("index.html", "w") as f:
        f.write(html)
    print("Patched avatar modal successfully")
else:
    print("Failed to patch avatar modal - pattern not found")
