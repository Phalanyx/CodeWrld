FROM rust:latest
WORKDIR /app
ENV FILE_CONTENT="fn main() {\\n\\tlet mut data = String::new();\\n\\tprintln!(\\\"Enter a number:\\\");\\n\\tstd::io::stdin().read_line(&mut data).expect(\\\"Failed to read line\\\");\\n\\tprintln!(\\\"You entered: {}\\\", data);\\n\\tlet mut data = String::new();\\n\\tstd::io::stdin().read_line(&mut data).expect(\\\"Failed to read line\\\");\\n\\tprintln!(\\\"You entered: {}\\\", data);\\n}"
ENV FILE_NAME="main"
ENV FILE_INPUT="hello\nyou\n"
ENTRYPOINT [ "timeout", "15" ]
CMD ["/bin/bash", "-c", "echo -e $FILE_CONTENT > ${FILE_NAME}.rs && echo -n -e $FILE_INPUT | rustc ${FILE_NAME}.rs && ./main"]
