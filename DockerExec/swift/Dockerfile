FROM swift:latest
WORKDIR /app
ENV FILE_CONTENT="import Foundation\\nprint(\\\"Enter a number:\\\")\\nif let data = readLine() {\\n\\tprint(\\\"You entered: \\\" + data)\\n}\\nif let data = readLine() {\\n\\tprint(\\\"You entered: \\\" + data)\\n}"
ENV FILE_NAME="main"
ENV FILE_INPUT="hello\nyou\n"
ENTRYPOINT [ "timeout", "15" ]
CMD ["/bin/bash", "-c", "echo -e $FILE_CONTENT > ${FILE_NAME}.swift && echo -n -e $FILE_INPUT | swift ${FILE_NAME}.swift"]
