FROM golang:latest
WORKDIR /app
ENV FILE_CONTENT="package main\\nimport (\\n\\t\\\"fmt\\\"\\n)\\nfunc main() {\\n\\tvar data string\\n\\tfmt.Println(\\\"Enter a number:\\\")\\n\\tfmt.Scanln(&data)\\n\\tfmt.Println(\\\"You entered: \", data)\\n\\tfmt.Scanln(&data)\\n\\tfmt.Println(\\\"You entered: \", data)\\n}"
ENV FILE_NAME="main"
ENV FILE_INPUT="hello\nyou\n"
ENTRYPOINT [ "timeout", "15" ]
CMD ["/bin/bash", "-c", "echo -e $FILE_CONTENT > ${FILE_NAME}.go && echo -n -e $FILE_INPUT | go run ${FILE_NAME}.go"]