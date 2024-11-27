FROM gcc:latest
WORKDIR /app
ENV FILE_CONTENT="#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n printf(\"hello \\\\n  \");}\n"
ENV FILE_NAME="main"
ENV FILE_INPUT=""
ENTRYPOINT [ "timeout", "15" ]
CMD ["/bin/bash", "-c", "echo -e $FILE_CONTENT > ${FILE_NAME}.c && gcc ${FILE_NAME}.c -o ${FILE_NAME} && echo -n -e $FILE_INPUT | ./${FILE_NAME}"]