package com.vlf.wma.api.features.firebase;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class FirebaseStorageService {
    private final Storage storage;
    private final String bucketName = "wmafirebase.firebasestorage.app";

    public FirebaseStorageService(Storage storage) {
        this.storage = storage;
    }

    public String uploadFile(MultipartFile file) throws IOException {
        // Generate unique file name
        String fileName = "profile_pictures/" + UUID.randomUUID() + "-" + file.getOriginalFilename();

        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();

        // Upload file to Firebase Storage
        Blob blob = storage.create(blobInfo, file.getBytes());

        // Generate the file's public URL
        return "https://firebasestorage.googleapis.com/v0/b/" + bucketName + "/o/" +
                fileName.replace("/", "%2F") + "?alt=media";
    }
}

