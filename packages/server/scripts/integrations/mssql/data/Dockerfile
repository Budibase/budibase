FROM mcr.microsoft.com/mssql/server@sha256:c4369c38385eba011c10906dc8892425831275bb035d5ce69656da8e29de50d8

ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=Passw0rd

COPY ./data /

ENTRYPOINT [ "/bin/bash", "entrypoint.sh" ]
CMD [ "/opt/mssql/bin/sqlservr" ]
