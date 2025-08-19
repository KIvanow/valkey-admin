# Dockerfile

FROM valkey/valkey:latest

# Copy the ReJSON module into the image (adjust the source path as needed)
COPY rejson.so /valkey/modules/rejson.so

# Set the working directory to match the container config
WORKDIR /data

# Set the entrypoint and default command to load the module
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["valkey-server", "--loadmodule", "/valkey/modules/rejson.so"]

# Expose the default Redis/Valkey port
EXPOSE 6379