package com.cnzlk

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import groovy.sql.GroovyRowResult
import groovy.sql.Sql

/**
 * Created by zhufang on 2017/2/20.
 */


def driver="com.mysql.jdbc.Driver"
def username="cmsroot"
def password="cmsroot"
def url="jdbc:mysql://192.168.2.202:4315/hysjzh_new?characterEncoding=UTF-8&amp;useOldAliasMetadataBehavior=true"
def file=new File("c:/test/moretable")
if(!file.exists()){
    file.mkdirs()
}
def file2=new File(file,"tables.txt");
if(file2.exists()){
    file2.delete()
}
def file3=new File(file,"columnmap.js");
if(file3.exists()){
    file3.delete()
}
def map2=[:]
Sql.withInstance(url,username,password,driver){Sql sql->
    sql.rows("select a.tableName,a.tableComment from relation_table1 a group by a.tableName,a.tableComment").each{
        List list=sql.rows("select a.columnComment,a.isNull,a.dataType,a.columnKey,a.characterLength from relation_table1 a where a.tableName=? order by a.columnOrder",it.tableName)
        String str=list.inject("${it.tableComment.replaceAll("-","_")};${it.tableName.replaceAll("-","_")}."){a,b->
            if(b.columnComment=="主键")
                a+""
            else
            a+"${b.columnComment.replaceAll("[\\s：]","")}\\n"
        }+"__\r\n"
        file2<<str
        def map=list.inject([:]){a,b->
            if(b.columnComment!="主键")
            a[(b.columnComment.replaceAll("[\\s：]",""))]=b
            a
        }
        map2[(it.tableName).replaceAll("-","_")]=map

    }
    file3<<new GsonBuilder().create().toJson(map2)
}