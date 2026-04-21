package com.pluggedorchid.backend.auth.mapper;

import com.pluggedorchid.backend.auth.dto.UserDto;
import com.pluggedorchid.backend.auth.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toDto(User user);
}