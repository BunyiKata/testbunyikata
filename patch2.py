with open("public/styles.css", "r") as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if i == 1538:
        new_lines.append('    border-image: url("data:image/svg+xml;utf8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3E%3Cpath d=\'M 15 3 L 45 3 A 12 12 0 0 0 57 15 L 57 45 A 12 12 0 0 0 45 57 L 15 57 A 12 12 0 0 0 3 45 L 3 15 A 12 12 0 0 0 15 3 Z\' fill=\'%23FF4D4D\' stroke=\'%23333333\' stroke-width=\'4\' stroke-linejoin=\'round\'/%3E%3C/svg%3E") 24 fill !important;\n')
    else:
        new_lines.append(line)

with open("public/styles.css", "w") as f:
    f.writelines(new_lines)
