resource "local_file" "foo" {
  content = "foo modified!"
  filename = "./foo.txt"
  directory_permission = "0777"
  file_permission = "0777"
}