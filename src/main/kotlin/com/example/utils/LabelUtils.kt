package com.example.utils

import com.google.protobuf.TextFormat
import object_detection.protos.StringIntLabelMapOuterClass.StringIntLabelMap
import org.springframework.util.ResourceUtils
import java.nio.charset.StandardCharsets
import java.nio.file.Files
import java.nio.file.Paths

object LabelUtils {
    @Throws(Exception::class)
    fun loadLabels(path: String?): Array<String?> {
        val text = String(Files.readAllBytes(Paths.get(path)), StandardCharsets.UTF_8)
        val builder = StringIntLabelMap.newBuilder()
        TextFormat.merge(text, builder)
        val proto = builder.build()
        val maxId = proto.itemList.maxBy { it.id }?.id!!
        val ret = arrayOfNulls<String>(maxId + 1)
        for (item in proto.itemList) {
            ret[item.id] = item.displayName
        }
        return ret
    }
}