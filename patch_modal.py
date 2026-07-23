import re

with open("public/app.js", "r") as f:
    js = f.read()

old_buka = r"document\.getElementById\('modal-pilih-avatar'\)\.classList\.add\('active'\);"
new_buka = "document.getElementById('modal-pilih-avatar').style.display = 'flex';"

if re.search(old_buka, js):
    js = re.sub(old_buka, new_buka, js)
    print("Patched bukaModalAvatar")

old_simpan = r"            tutupModal\(\);\n        \};"
new_simpan = "            document.getElementById('modal-pilih-avatar').style.display = 'none';\n        };"

if re.search(old_simpan, js):
    js = re.sub(old_simpan, new_simpan, js)
    print("Patched simpanProfilEdit")

with open("public/app.js", "w") as f:
    f.write(js)
